const crypto = require('crypto');
const redis = require('../_lib/redis');
const { submitCard } = require('../_lib/napthe');

const TX_TTL_SECONDS = 60 * 60 * 24; // giữ log giao dịch 24h để đối soát
const VALID_TELCO = ['Viettel', 'Vinaphone', 'Mobifone', 'Garena', 'Zing', 'Gate', 'Vietnamobile', 'Vcoin'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
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
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Mệnh giá không hợp lệ.' });
    }

    const requestId = crypto.randomBytes(8).toString('hex');
    const txKey = `card_tx:${requestId}`;

    await redis.set(txKey, {
      telco,
      code: String(code).trim(),
      serial: String(serial).trim(),
      declaredAmount: Number(amount),
      status: 'pending',
      createdAt: Date.now(),
    }, { ex: TX_TTL_SECONDS });

    let gatewayData;
    try {
      gatewayData = await submitCard({ telco, code, serial, amount, requestId });
    } catch (err) {
      console.error('[napthe/submit] gateway error', err);
      await redis.set(txKey, {
        telco, code: String(code).trim(), serial: String(serial).trim(),
        declaredAmount: Number(amount), status: 'failed', message: 'Không kết nối được cổng nạp thẻ.',
        createdAt: Date.now(), updatedAt: Date.now(),
      }, { ex: TX_TTL_SECONDS });
      return res.status(502).json({ error: 'Không kết nối được cổng nạp thẻ, vui lòng thử lại.' });
    }

    // Code=1: gateway đã NHẬN thẻ để xử lý (chưa phải kết quả cuối) — chờ callback báo thật
    // Code=0: gateway TỪ CHỐI ngay (sai định dạng, ApiKey sai, loại thẻ không hỗ trợ...)
    if (Number(gatewayData.Code) === 1) {
      await redis.set(txKey, {
        telco, code: String(code).trim(), serial: String(serial).trim(),
        declaredAmount: Number(amount), status: 'pending',
        taskId: gatewayData.TaskId, createdAt: Date.now(), updatedAt: Date.now(),
      }, { ex: TX_TTL_SECONDS });

      return res.status(200).json({
        requestId,
        status: 'pending',
        message: gatewayData.Message || 'Thẻ đã được gửi, đang chờ xử lý.',
      });
    }

    await redis.set(txKey, {
      telco, code: String(code).trim(), serial: String(serial).trim(),
      declaredAmount: Number(amount), status: 'failed',
      message: gatewayData.Message || '', createdAt: Date.now(), updatedAt: Date.now(),
    }, { ex: TX_TTL_SECONDS });

    return res.status(200).json({
      requestId,
      status: 'failed',
      message: gatewayData.Message || 'Gửi thẻ thất bại, vui lòng kiểm tra lại thông tin.',
    });
  } catch (err) {
    console.error('[napthe/submit]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};
