const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação JWT.
 * 
 * Verifica se o token JWT enviado no header Authorization é válido.
 * O token deve ser enviado no formato: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtém o header de autorização
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Não autorizado',
        message: 'Token de autenticação não fornecido'
      });
    }

    // Verifica se o formato é "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Não autorizado',
        message: 'Formato do token inválido. Use: Bearer <token>'
      });
    }

    const token = parts[1];

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Não autorizado',
        message: 'Token expirado'
      });
    }

    return res.status(401).json({
      error: 'Não autorizado',
      message: 'Token inválido'
    });
  }
};

module.exports = authMiddleware;
