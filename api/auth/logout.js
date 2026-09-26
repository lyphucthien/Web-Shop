const { clearAuthCookie } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }
  clearAuthCookie(res);
  return res.status(200).json({ ok: true });
};
