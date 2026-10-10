const crypto = require('crypto');
const redis = require('../../_lib/redis');

const TTL_SECONDS = 180; // 3 phút

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const sid = crypto.randomBytes(16).toString('hex');
    await redis.set(`qr:${sid}`, { status: 'pending' }, { ex: TTL_SECONDS });

    return res.status(200).json({ sid, expiresIn: TTL_SECONDS });
  } catch (err) {
    console.error('[qr/create]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
