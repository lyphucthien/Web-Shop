const redis = require('../../_lib/redis');
const { signJWT, setAuthCookie } = require('../../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const { claimToken } = req.body || {};
    if (!claimToken) {
      return res.status(400).json({ error: 'Thiếu mã xác thực.' });
    }

    const key = `qrclaim:${claimToken}`;
    const data = await redis.get(key);
    if (!data || !data.username) {
      return res.status(410).json({ error: 'Phiên đăng nhập đã hết hạn.' });
    }

    // Dùng 1 lần rồi xoá ngay để tránh bị dùng lại (replay)
    await redis.del(key);

    const token = signJWT({ username: data.username });
    setAuthCookie(res, token);

    return res.status(200).json({ ok: true, username: data.username });
  } catch (err) {
    console.error('[qr/claim]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
