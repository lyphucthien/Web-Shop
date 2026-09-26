const crypto = require('crypto');
const redis = require('../../_lib/redis');
const { getUserFromRequest } = require('../../_lib/auth');

const CLAIM_TTL_SECONDS = 60;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Bạn cần đăng nhập trước khi xác nhận.' });
    }

    const { sid } = req.body || {};
    if (!sid) {
      return res.status(400).json({ error: 'Thiếu mã phiên.' });
    }

    const key = `qr:${sid}`;
    const data = await redis.get(key);
    if (!data) {
      return res.status(410).json({ error: 'Mã QR đã hết hạn, vui lòng thử lại.' });
    }

    const claimToken = crypto.randomBytes(20).toString('hex');

    await redis.set(key, {
      status: 'confirmed',
      claimToken,
      username: user.username,
    }, { ex: CLAIM_TTL_SECONDS });

    await redis.set(`qrclaim:${claimToken}`, { username: user.username }, { ex: CLAIM_TTL_SECONDS });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[qr/confirm]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
