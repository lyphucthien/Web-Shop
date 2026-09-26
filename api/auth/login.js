const redis = require('../_lib/redis');
const { comparePassword, signJWT, setAuthCookie } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.' });
    }

    const key = `user:${username.toLowerCase()}`;
    const user = await redis.hgetall(key);

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không đúng.' });
    }

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không đúng.' });
    }

    const token = signJWT({ username: user.username });
    setAuthCookie(res, token);

    return res.status(200).json({ ok: true, username: user.username });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
