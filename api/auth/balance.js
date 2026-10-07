const redis = require('../_lib/redis');
const { getUserFromRequest } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Chưa đăng nhập.' });
    }
    const raw = await redis.hget(`user:${user.username.toLowerCase()}`, 'balance');
    const balance = Math.max(0, Number(raw) || 0);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ balance, currency: 'VND' });
  } catch (err) {
    console.error('[balance]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
