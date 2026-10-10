const crypto = require('crypto');
const redis = require('./redis');
const { creditDeposit, addHistory } = require('./wallet');

// Theo tài liệu doithegiatot.com: chỉ cần 1 ApiKey (gửi thẳng trong JSON, không ký MD5 trên request)
const API_KEY = process.env.NAPTHE_PARTNER_KEY;
const BASE_URL = 'https://doithegiatot.com/api/card';

// CardType đúng theo tài liệu
const CARD_TYPE = {
  Viettel: 1,
  Mobifone: 2,
  Vinaphone: 3,
  'Vcoin-VTC Game': 4,
  Garena: 6,
  Zing: 14,
  Gate: 15,
  Vietnamobile: 16,
  Vcoin: 23,
};

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

// Callback: Hash = MD5(APIKey + Pin + Seri)
function signCallback(pin, seri) {
  return md5(`${API_KEY}${pin}${seri}`);
}

// 1.1 Gửi thẻ: POST /api/card  -> { Code, Message, TaskId, wrongPrice }
async function submitCard({ telco, code, serial, amount, requestId }) {
  if (!API_KEY) throw new Error('Thiếu NAPTHE_PARTNER_KEY (ApiKey) trong biến môi trường.');

  const cardType = CARD_TYPE[telco];
  if (!cardType) return { Code: 0, Message: `Loại thẻ "${telco}" chưa được hỗ trợ.` };

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ApiKey: API_KEY,
      // Tài liệu ghi APIPin nhưng server báo thiếu "Pin" -> gửi cả 2 tên cho chắc
      Pin: String(code).trim(),
      APIPin: String(code).trim(),
      Seri: String(serial).trim(),
      CardType: cardType,
      CardValue: Number(amount),
      requestid: requestId,
    }),
  });
  return res.json();
}

// 1.2.1 Hỏi kết quả: GET /api/card?requestid=..&apikey=..
// -> { Code: 0 lỗi kiểm tra | 1 đang xử lý | 2 thành công | 3 thất bại, Message, CardValue, wrongPrice }
async function checkCard(requestId) {
  if (!API_KEY) throw new Error('Thiếu NAPTHE_PARTNER_KEY (ApiKey) trong biến môi trường.');
  const url = `${BASE_URL}?requestid=${encodeURIComponent(requestId)}&apikey=${encodeURIComponent(API_KEY)}`;
  const res = await fetch(url, { method: 'GET' });
  return res.json();
}

const TX_TTL = 60 * 60 * 24 * 7;
const fmtVND = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ';

// Chốt kết quả 1 giao dịch thẻ: cộng tiền (nếu thành công) rồi mới đánh dấu xong.
// Cộng tiền chạy trước nên nếu lỗi giữa chừng, giao dịch vẫn "pending" và lần hỏi sau sẽ thử lại.
async function settleCard(requestId, tx, result) {
  const txKey = `card_tx:${requestId}`;
  if (result.status === 'success') {
    if (tx.username) {
      const rate = Math.min(100, Math.max(1, Number(process.env.NAPTHE_RATE) || 100));
      const credit = Math.floor((Number(result.realAmount) || 0) * rate / 100);
      await creditDeposit({
        username: tx.username,
        amount: credit,
        source: 'card',
        ref: requestId,
        title: `Nạp thẻ ${tx.telco} ${fmtVND(result.realAmount)}`,
      });
    }
  } else if (tx.username) {
    const first = await redis.set(`hist_lock:card:${requestId}`, '1', { nx: true, ex: TX_TTL });
    if (first) {
      await addHistory(tx.username, 'deposit', {
        id: `card:${requestId}`,
        title: `Nạp thẻ ${tx.telco} ${fmtVND(tx.declaredAmount)}`,
        amount: tx.declaredAmount,
        status: 'failed',
        message: result.message || '',
        at: Date.now(),
      });
    }
  }
  const updated = {
    ...tx,
    status: result.status,
    realAmount: result.status === 'success' ? Number(result.realAmount) || 0 : undefined,
    wrongPrice: !!result.wrongPrice,
    message: result.message || '',
    updatedAt: Date.now(),
  };
  await redis.set(txKey, updated, { ex: TX_TTL });
  return updated;
}

module.exports = { submitCard, checkCard, signCallback, settleCard, CARD_TYPE, TX_TTL };
