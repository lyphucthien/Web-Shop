const { getUserFromRequest } = require('../_lib/auth');

module.exports = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Chưa đăng nhập.' });
    }
    return res.status(200).json({ username: user.username });
  } catch (err) {
    console.error('[me]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
