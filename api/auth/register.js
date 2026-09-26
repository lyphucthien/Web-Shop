const redis = require('../_lib/redis');
const { hashPassword } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const { username, password, confirmPassword } = req.body || {};

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username || '')) {
      return res.status(400).json({ error: 'Tên đăng nhập 3-20 ký tự: chữ, số, dấu _' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải từ 6 ký tự trở lên.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Mật khẩu nhập lại không khớp.' });
    }

    const key = `user:${username.toLowerCase()}`;
    const exists = await redis.exists(key);
    if (exists) {
      return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại.' });
    }

    const passwordHash = await hashPassword(password);
    await redis.hset(key, {
      username,
      passwordHash,
      createdAt: Date.now(),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
