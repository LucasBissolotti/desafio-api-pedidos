const jwt = require('jsonwebtoken');

/**
 * Controller de autenticação.
 * Fornece um endpoint para gerar tokens JWT para testes.
 */

/**
 * Gera um token JWT.
 * Este endpoint é para fins de demonstração/teste.
 * Em produção, deveria validar credenciais reais.
 * 
 * POST /auth/login
 * Body: { "username": "admin", "password": "admin" }
 */
const login = (req, res) => {
  try {
    const { username, password } = req.body;

    // Validação básica dos campos
    if (!username || !password) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'Os campos "username" e "password" são obrigatórios'
      });
    }

    // Validação simples para demonstração
    // Em produção, validar contra banco de dados com hash de senha
    if (username === 'admin' && password === 'admin') {
      // Gera o token JWT com expiração de 1 hora
      const token = jwt.sign(
        { username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        token
      });
    }

    return res.status(401).json({
      error: 'Não autorizado',
      message: 'Credenciais inválidas'
    });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao realizar o login'
    });
  }
};

module.exports = { login };
