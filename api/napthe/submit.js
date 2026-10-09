const crypto = require('crypto');
const redis = require('../_lib/redis');
const { getUserFromRequest } = require('../_lib/auth');
const { submitCard, settleCard, TX_TTL } = require('../_lib/napthe');

const VALID_TELCO = ['Viettel', 'Vinaphone', 'Mobifone', 'Garena', 'Zing', 'Gate', 'Vietnamobile', 'Vcoin'];
const VALID_AMOUNT = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập để nạp thẻ.' });
    }

    const { telco, code, serial, amount } = req.body || {};

    if (!VALID_TELCO.includes(telco)) {
      return res.status(400).json({ error: 'Loại thẻ không hợp lệ.' });
    }
    if (!code || !/^[0-9A-Za-z]{6,30}$/.test(String(code).trim())) {
      return res.status(400).json({ error: 'Mã thẻ không hợp lệ.' });
    }
    if (!serial || !/^[0-9A-Za-z]{6,20}$/.test(String(serial).trim())) {
      return res.status(400).json({ error: 'Số serial không hợp lệ.' });
    }
    if (!VALID_AMOUNT.includes(Number(amount))) {
      return res.status(400).json({ error: 'Mệnh giá không hợp lệ.' });
    }

    const lower = user.username.toLowerCase();
    const rlKey = `rl:card:${lower}`;
    const count = await redis.incr(rlKey);
    if (count === 1) await redis.expire(rlKey, 60);
    if (count > 5) {
      return res.status(429).json({ error: 'Bạn gửi thẻ quá nhanh, vui lòng thử lại sau 1 phút.' });
    }

    const cleanCode = String(code).trim();
    const cleanSerial = String(serial).trim();
    const dup = await redis.set(`card_dup:${telco}:${cleanSerial}`, '1', { nx: true, ex: 120 });
    if (!dup) {
      return res.status(409).json({ error: 'Thẻ này vừa được gửi, vui lòng chờ kết quả.' });
    }

    const requestId = crypto.randomBytes(8).toString('hex');
    const txKey = `card_tx:${requestId}`;
    const base = {
      username: user.username,
      telco,
      code: cleanCode,
      serial: cleanSerial,
      declaredAmount: Number(amount),
      createdAt: Date.now(),
    };

    await redis.set(txKey, { ...base, status: 'pending' }, { ex: TX_TTL });

    let gatewayData;
    try {
      gatewayData = await submitCard({ telco, code: cleanCode, serial: cleanSerial, amount, requestId });
    } catch (err) {
      console.error('[napthe/submit] gateway error', err);
      await settleCard(requestId, { ...base, status: 'pending' }, { status: 'failed', message: 'Không kết nối được cổng nạp thẻ.' });
      return res.status(502).json({ error: 'Không kết nối được cổng nạp thẻ, vui lòng thử lại.' });
    }

    if (Number(gatewayData.Code) === 1) {
      await redis.set(txKey, { ...base, status: 'pending', taskId: gatewayData.TaskId, updatedAt: Date.now() }, { ex: TX_TTL });
      return res.status(200).json({
        requestId,
        status: 'pending',
        message: gatewayData.Message || 'Thẻ đã được gửi, đang chờ xử lý.',
      });
    }

    const message = gatewayData.Message || 'Gửi thẻ thất bại, vui lòng kiểm tra lại thông tin.';
    await settleCard(requestId, { ...base, status: 'pending' }, { status: 'failed', message });
    return res.status(200).json({ requestId, status: 'failed', message });
  } catch (err) {
    console.error('[napthe/submit]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
