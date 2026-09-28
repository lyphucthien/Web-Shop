const redis = require('../_lib/redis');
const { checkCard } = require('../_lib/napthe');

const TTL = 60 * 60 * 24;

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const { requestId } = req.query;
    if (!requestId) {
      return res.status(400).json({ error: 'Thiếu requestId.' });
    }

    const txKey = `card_tx:${requestId}`;
    const tx = await redis.get(txKey);
    if (!tx) {
      return res.status(200).json({ status: 'expired' });
    }

    // Nếu còn đang chờ, chủ động hỏi thẳng cổng (không phụ thuộc callback)
    if (tx.status === 'pending') {
      try {
        const r = await checkCard(requestId);
        const code = Number(r.Code);
        if (code === 2) {
          const realAmount = Number(r.CardValue || tx.declaredAmount);
          const updated = { ...tx, status: 'success', realAmount, wrongPrice: !!r.wrongPrice, message: r.Message || '', updatedAt: Date.now() };
          await redis.set(txKey, updated, { ex: TTL });
          return res.status(200).json({ status: 'success', realAmount, wrongPrice: !!r.wrongPrice, message: updated.message });
        }
        if (code === 3) {
          const updated = { ...tx, status: 'failed', message: r.Message || 'Thẻ không hợp lệ.', updatedAt: Date.now() };
          await redis.set(txKey, updated, { ex: TTL });
          return res.status(200).json({ status: 'failed', message: updated.message });
        }
      } catch (err) {
        console.error('[napthe/status] checkCard lỗi tạm thời', err);
      }
    }

    return res.status(200).json({
      status: tx.status,
      realAmount: tx.realAmount,
      wrongPrice: tx.wrongPrice,
      message: tx.message,
    });
  } catch (err) {
    console.error('[napthe/status]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};
