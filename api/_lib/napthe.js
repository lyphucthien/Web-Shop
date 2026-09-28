const crypto = require('crypto');

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

module.exports = { submitCard, checkCard, signCallback, CARD_TYPE };
