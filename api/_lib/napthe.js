const crypto = require('crypto');

const PARTNER_ID = process.env.NAPTHE_PARTNER_ID;
const PARTNER_KEY = process.env.NAPTHE_PARTNER_KEY;
const ENDPOINT = process.env.NAPTHE_ENDPOINT || 'https://doithegiatot.com/chargingws/v2';

const TELCO_MAP = {
  Viettel: 'VIETTEL',
  Vinaphone: 'VINAPHONE',
  Mobifone: 'MOBIFONE',
  Garena: 'GATE', // một số cổng dùng mã riêng cho thẻ game, giữ nguyên tên gốc nếu cổng không nhận GATE
  Zing: 'ZING',
  Vcoin: 'VCOIN',
  Scoin: 'VNMOBILE',
};

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

// Chữ ký gửi thẻ: md5(partner_key + code + serial)
function signCharging(code, serial) {
  return md5(`${PARTNER_KEY}${code}${serial}`);
}

// Chữ ký callback bên gateway gửi về cũng dùng cùng công thức để mình xác thực
function signCallback(code, serial) {
  return md5(`${PARTNER_KEY}${code}${serial}`);
}

function normalizeTelco(telcoLabel) {
  return TELCO_MAP[telcoLabel] || String(telcoLabel).toUpperCase();
}

async function submitCard({ telco, code, serial, amount, requestId }) {
  if (!PARTNER_ID || !PARTNER_KEY) {
    throw new Error('Thiếu NAPTHE_PARTNER_ID / NAPTHE_PARTNER_KEY trong biến môi trường.');
  }

  const body = new URLSearchParams({
    telco: normalizeTelco(telco),
    code: String(code).trim(),
    serial: String(serial).trim(),
    amount: String(amount),
    request_id: requestId,
    partner_id: PARTNER_ID,
    command: 'charging',
    sign: signCharging(String(code).trim(), String(serial).trim()),
  });

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await res.json();
  return data; // { status, message, code, serial, ... }
}

module.exports = { submitCard, signCallback, normalizeTelco, PARTNER_ID, PARTNER_KEY };
