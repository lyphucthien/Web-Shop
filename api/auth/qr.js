const handlers = {
  create: require('../_qr/create'),
  status: require('../_qr/status'),
  claim: require('../_qr/claim'),
  confirm: require('../_qr/confirm'),
};

module.exports = (req, res) => {
  const handler = handlers[req.query && req.query.action];
  if (!handler) {
    return res.status(404).json({ error: 'Không tìm thấy.' });
  }
  return handler(req, res);
};
