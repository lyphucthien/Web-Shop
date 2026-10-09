const redis = require('./redis');

function clientIp(req) {
  const h = req.headers || {};
  const raw = h['x-real-ip'] || (h['x-forwarded-for'] || '').split(',')[0] || (req.socket && req.socket.remoteAddress) || 'unknown';
  return String(raw).trim();
}

async function allow(req, name, limit, windowSec) {
  try {
    const key = `rl:${name}:${clientIp(req)}`;
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, windowSec);
    return n <= limit;
  } catch (err) {
    console.error('[limit]', err);
    return true;
  }
}

module.exports = { allow, clientIp };
