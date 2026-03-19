module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CodeLab Serverless API Ready (Vanilla JS)',
    timestamp: new Date().toISOString()
  });
};
