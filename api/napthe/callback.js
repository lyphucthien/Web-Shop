const redis = require('../_lib/redis');
const { signCallback, checkCard, settleCard } = require('../_lib/napthe');

module.exports = async (req, res) => {
  const body = req.method === 'GET' ? req.query : (req.body || {});

  try {
    const { requestid: requestId, CardValue, Success, amount, Hash } = body;

    if (!requestId) {
      return res.status(400).json({ error: 'Thiếu requestid.' });
    }

    const tx = await redis.get(`card_tx:${requestId}`);
    if (!tx) {
      console.warn('[napthe/callback] requestid không tìm thấy:', requestId);
      return res.status(200).json({ ok: true });
    }

    const expectedHash = signCallback(tx.code, tx.serial);
    if (!Hash || Hash !== expectedHash) {
      console.error('[napthe/callback] SAI HASH — có thể là request giả mạo. requestid:', requestId);
      return res.status(403).json({ error: 'Chữ ký không hợp lệ.' });
    }

    if (tx.status === 'success' || tx.status === 'failed') {
      return res.status(200).json({ ok: true, note: 'already_processed' });
    }

    const isSuccess = Success === true || Success === 'true';

    if (!isSuccess) {
      await settleCard(requestId, tx, { status: 'failed', message: 'Thẻ không hợp lệ hoặc sai thông tin.' });
      return res.status(200).json({ ok: true });
    }

    let realAmount = Number(amount ?? CardValue ?? 0);
    if (!(realAmount > 0)) {
      try {
        const r = await checkCard(requestId);
        if (Number(r.Code) === 2) realAmount = Number(r.CardValue || 0);
      } catch (err) {
        console.error('[napthe/callback] không xác minh được giá trị thẻ', err);
      }
    }
    if (!(realAmount > 0)) {
      return res.status(200).json({ ok: true, note: 'waiting_verify' });
    }

    await settleCard(requestId, tx, { status: 'success', realAmount });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[napthe/callback]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};
