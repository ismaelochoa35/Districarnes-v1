const sessionService = require('../services/sessionService');

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  const user = token ? sessionService.find(token) : null;
  if (!user) {
    return res.status(401).json({ message: 'Sesión no válida' });
  }

  req.token = token;
  req.user = user;
  next();
}

module.exports = { requireAuth };
