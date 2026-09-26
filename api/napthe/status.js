const redis = require('../_lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const { requestId } = req.query;
    if (!requestId) {
      return res.status(400).json({ error: 'Thiếu requestId.' });
    }

    const tx = await redis.get(`card_tx:${requestId}`);
    if (!tx) {
      return res.status(200).json({ status: 'expired' });
    }

    return res.status(200).json({
      status: tx.status,
      realAmount: tx.realAmount,
      message: tx.message,
    });
  } catch (err) {
    console.error('[napthe/status]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};
