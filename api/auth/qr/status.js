const redis = require('../../_lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const { sid } = req.query;
    if (!sid) {
      return res.status(400).json({ error: 'Thiếu mã phiên.' });
    }

    const data = await redis.get(`qr:${sid}`);
    if (!data) {
      return res.status(200).json({ status: 'expired' });
    }

    if (data.status === 'confirmed' && data.claimToken) {
      return res.status(200).json({ status: 'confirmed', claimToken: data.claimToken });
    }

    return res.status(200).json({ status: data.status || 'pending' });
  } catch (err) {
    console.error('[qr/status]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
