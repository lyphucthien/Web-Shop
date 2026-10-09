const redis = require('../_lib/redis');
const { findUsernameByUid, creditDeposit } = require('../_lib/wallet');

// Webhook SePay (https://sepay.vn): tiền vào tài khoản -> tự cộng số dư theo nội dung "LPT<ID>".
// Cần biến môi trường SEPAY_API_KEY; (tuỳ chọn) BANK_ACCOUNT để chỉ nhận đúng số tài khoản của shop.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ.' });
  }

  const apiKey = process.env.SEPAY_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ success: false, message: 'Chưa cấu hình SEPAY_API_KEY.' });
  }
  if ((req.headers.authorization || '') !== `Apikey ${apiKey}`) {
    return res.status(401).json({ success: false, message: 'Sai API key.' });
  }

  try {
    const b = req.body || {};
    if (b.transferType !== 'in') {
      return res.status(200).json({ success: true });
    }
    if (process.env.BANK_ACCOUNT && b.accountNumber && String(b.accountNumber) !== String(process.env.BANK_ACCOUNT)) {
      return res.status(200).json({ success: true });
    }

    const ref = String(b.id || b.referenceCode || '');
    const amount = Number(b.transferAmount) || 0;
    if (!ref || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Dữ liệu giao dịch không hợp lệ.' });
    }

    const text = `${b.content || ''} ${b.description || ''}`;
    const m = text.match(/LPT\s*-?\s*(\d{3,10})/i);
    const username = m ? await findUsernameByUid(m[1]) : null;

    if (!username) {
      console.warn('[bank/webhook] không khớp nội dung chuyển khoản:', ref, text);
      await redis.lpush('bank_unmatched', { ref, amount, text: text.slice(0, 200), at: Date.now() });
      await redis.ltrim('bank_unmatched', 0, 99);
      return res.status(200).json({ success: true });
    }

    await creditDeposit({
      username,
      amount,
      source: 'bank',
      ref,
      title: `Chuyển khoản ${b.gateway || 'ngân hàng'}`,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[bank/webhook]', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};
