const redis = require('../_lib/redis');
const { signCallback } = require('../_lib/napthe');

function pickRealAmount(body, fallback) {
  const candidates = [body.value, body.real_amount, body.amount_real, body.declared_value, body.amount];
  const found = candidates.find(v => v !== undefined && v !== null && !Number.isNaN(Number(v)));
  return found !== undefined ? Number(found) : Number(fallback);
}

module.exports = async (req, res) => {
  const body = req.method === 'GET' ? req.query : (req.body || {});

  try {
    const { request_id: requestId, status, code, serial } = body;
    const receivedSign = body.sign || body.callback_sign;

    if (!requestId) {
      return res.status(400).json({ error: 'Thiếu request_id.' });
    }

    const txKey = `card_tx:${requestId}`;
    const tx = await redis.get(txKey);

    if (!tx) {
      console.warn('[napthe/callback] request_id không tìm thấy:', requestId);
      return res.status(200).json({ ok: true });
    }

    const expectedSign = signCallback(code || tx.code, serial || tx.serial);
    if (receivedSign && receivedSign !== expectedSign) {
      console.error('[napthe/callback] SAI CHỮ KÝ — có thể là request giả mạo. request_id:', requestId);
      return res.status(403).json({ error: 'Chữ ký không hợp lệ.' });
    }

    if (tx.status === 'success' || tx.status === 'failed') {
      return res.status(200).json({ ok: true, note: 'already_processed' });
    }

    const gwStatus = Number(status);

    if (gwStatus === 1 || gwStatus === 2) {
      const realAmount = pickRealAmount(body, tx.declaredAmount);
      await redis.set(txKey, {
        ...tx,
        realAmount,
        status: 'success',
        message: body.message || '',
        updatedAt: Date.now(),
      }, { ex: 60 * 60 * 24 });
    } else {
      await redis.set(txKey, {
        ...tx,
        status: 'failed',
        message: body.message || '',
        updatedAt: Date.now(),
      }, { ex: 60 * 60 * 24 });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[napthe/callback]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};
