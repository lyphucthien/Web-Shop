const redis = require('../_lib/redis');
const { signCallback } = require('../_lib/napthe');

module.exports = async (req, res) => {
  const body = req.method === 'GET' ? req.query : (req.body || {});

  try {
    const { requestid: requestId, Pin, Seri, CardValue, Success, amount, Hash } = body;

    if (!requestId) {
      return res.status(400).json({ error: 'Thiếu requestid.' });
    }

    const txKey = `card_tx:${requestId}`;
    const tx = await redis.get(txKey);

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
    const realAmount = Number(amount ?? CardValue ?? 0);

    await redis.set(txKey, {
      ...tx,
      realAmount: isSuccess ? realAmount : undefined,
      status: isSuccess ? 'success' : 'failed',
      updatedAt: Date.now(),
    }, { ex: 60 * 60 * 24 });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[napthe/callback]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};
