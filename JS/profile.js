const redis = require('../_lib/redis');
const { getUserFromRequest, hashPassword, comparePassword } = require('../_lib/auth');

module.exports = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Chưa đăng nhập.' });
    }
    const key = `user:${user.username.toLowerCase()}`;
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'GET') {
      const u = (await redis.hgetall(key)) || {};
      return res.status(200).json({
        username: user.username,
        balance: Math.max(0, Number(u.balance) || 0),
        totalDeposit: Math.max(0, Number(u.totalDeposit) || 0),
        fullName: u.fullName || '',
        email: u.email || '',
        phone: u.phone || '',
        createdAt: Number(u.createdAt) || null,
      });
    }

    if (req.method === 'POST') {
      const b = req.body || {};

      if (b.action === 'password') {
        const oldPassword = String(b.oldPassword || '');
        const newPassword = String(b.newPassword || '');
        if (!oldPassword) {
          return res.status(400).json({ error: 'Vui lòng nhập mật khẩu hiện tại.' });
        }
        if (newPassword.length < 6) {
          return res.status(400).json({ error: 'Mật khẩu mới phải từ 6 ký tự trở lên.' });
        }
        if (newPassword !== String(b.confirmPassword || '')) {
          return res.status(400).json({ error: 'Mật khẩu nhập lại không khớp.' });
        }
        const u = (await redis.hgetall(key)) || {};
        if (!(await comparePassword(oldPassword, u.passwordHash))) {
          return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng.' });
        }
        await redis.hset(key, { passwordHash: await hashPassword(newPassword) });
        return res.status(200).json({ ok: true });
      }

      const fullName = String(b.fullName || '').trim();
      const email = String(b.email || '').trim();
      const phone = String(b.phone || '').trim();
      if (fullName.length > 50) {
        return res.status(400).json({ error: 'Họ và tên tối đa 50 ký tự.' });
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email không hợp lệ.' });
      }
      if (email.length > 100) {
        return res.status(400).json({ error: 'Email tối đa 100 ký tự.' });
      }
      if (phone && !/^[0-9+]{8,15}$/.test(phone)) {
        return res.status(400).json({ error: 'Số điện thoại không hợp lệ.' });
      }
      await redis.hset(key, { fullName, email, phone });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  } catch (err) {
    console.error('[profile]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};