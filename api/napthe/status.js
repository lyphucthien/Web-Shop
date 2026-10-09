const redis = require('../_lib/redis');
const { getUserFromRequest } = require('../_lib/auth');
const { checkCard, settleCard } = require('../_lib/napthe');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập.' });
    }

    const { requestId } = req.query;
    if (!requestId || !/^[0-9a-f]{16}$/.test(String(requestId))) {
      return res.status(400).json({ error: 'Thiếu requestId.' });
    }

    const tx = await redis.get(`card_tx:${requestId}`);
    if (!tx) {
      return res.status(200).json({ status: 'expired' });
    }
    if (tx.username && tx.username.toLowerCase() !== user.username.toLowerCase()) {
      return res.status(403).json({ error: 'Giao dịch không thuộc tài khoản này.' });
    }

    let current = tx;
    if (tx.status === 'pending') {
      try {
        const r = await checkCard(requestId);
        const code = Number(r.Code);
        if (code === 2) {
          current = await settleCard(requestId, tx, {
            status: 'success',
            realAmount: Number(r.CardValue || tx.declaredAmount),
            wrongPrice: !!r.wrongPrice,
            message: r.Message || '',
          });
        } else if (code === 3) {
          current = await settleCard(requestId, tx, { status: 'failed', message: r.Message || 'Thẻ không hợp lệ.' });
        }
      } catch (err) {
        console.error('[napthe/status] lỗi tạm thời, sẽ thử lại lượt sau', err);
      }
    }

    return res.status(200).json({
      status: current.status,
      realAmount: current.realAmount,
      wrongPrice: current.wrongPrice,
      message: current.message,
    });
  } catch (err) {
    console.error('[napthe/status]', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};
