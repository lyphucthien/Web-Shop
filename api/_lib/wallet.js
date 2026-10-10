const redis = require('./redis');

const HIST_MAX = 200;
const HIST_TYPES = ['purchase', 'service', 'minigame', 'deposit', 'withdraw'];
const LOCK_TTL = 60 * 60 * 24 * 400;

const userKey = (username) => `user:${String(username).toLowerCase()}`;

// Mỗi tài khoản có 1 ID số duy nhất (nội dung chuyển khoản LPT<ID>).
// Số lấy từ bộ đếm INCR (nguyên tử) nên 2 người không bao giờ nhận cùng 1 số; mã được giữ chỗ trước khi gán.
async function ensureUid(username) {
  const lower = String(username).toLowerCase();
  const key = userKey(lower);
  const cur = await redis.hget(key, 'uid');
  if (cur) return Number(cur);

  const n = 3000 + Number(await redis.incr('uid:seq'));
  const reserved = await redis.set(`uid:${n}`, lower, { nx: true });
  if (!reserved) return ensureUid(username);

  const won = await redis.hsetnx(key, 'uid', n);
  if (!won) {
    await redis.del(`uid:${n}`);
    return Number(await redis.hget(key, 'uid'));
  }
  return n;
}

async function findUsernameByUid(uid) {
  const v = await redis.get(`uid:${uid}`);
  return v == null ? null : String(v);
}

async function addHistory(username, type, entry) {
  const key = `hist:${String(username).toLowerCase()}:${type}`;
  await redis.lpush(key, entry);
  await redis.ltrim(key, 0, HIST_MAX - 1);
}

async function getHistory(username, type, limit = 100) {
  if (!HIST_TYPES.includes(type)) return [];
  const rows = await redis.lrange(`hist:${String(username).toLowerCase()}:${type}`, 0, limit - 1);
  return (rows || []).filter((r) => r && typeof r === 'object');
}

// Cộng tiền đúng 1 lần cho mỗi (source, ref): gọi lại nhiều lần / callback trùng cũng không cộng lặp.
async function creditDeposit({ username, amount, source, ref, title }) {
  const value = Math.floor(Number(amount));
  if (!(value > 0)) return { credited: false, reason: 'invalid_amount' };

  const lock = `credit:${source}:${ref}`;
  const got = await redis.set(lock, Date.now(), { nx: true, ex: LOCK_TTL });
  if (!got) return { credited: false, reason: 'duplicate' };

  const key = userKey(username);
  try {
    const tx = redis.multi();
    tx.hincrby(key, 'balance', value);
    tx.hincrby(key, 'totalDeposit', value);
    await tx.exec();
  } catch (err) {
    await redis.del(lock);
    throw err;
  }

  await addHistory(username, 'deposit', {
    id: `${source}:${ref}`,
    title,
    amount: value,
    status: 'success',
    at: Date.now(),
  });
  return { credited: true, amount: value };
}

module.exports = { ensureUid, findUsernameByUid, addHistory, getHistory, creditDeposit, userKey, HIST_TYPES };
