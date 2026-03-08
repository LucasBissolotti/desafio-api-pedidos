const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const swaggerSpec = require('./config/swagger');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializa o Express
const app = express();

// Middleware para parsear JSON no body das requisições
app.use(express.json());

// Documentação Swagger disponível em /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'API Pedidos - Documentação',
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Rotas de autenticação (pública)
app.use('/auth', authRoutes);

// Rotas de pedidos (protegidas por JWT)
app.use('/order', orderRoutes);

// Rota raiz - informações da API
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'API de Gerenciamento de Pedidos',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: {
        login: 'POST /auth/login'
      },
      orders: {
        create: 'POST /order',
        getById: 'GET /order/:orderId',
        list: 'GET /order/list',
        update: 'PUT /order/:orderId',
        delete: 'DELETE /order/:orderId'
      }
    }
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.originalUrl} não existe`
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: 'Ocorreu um erro inesperado'
  });
});

// Define a porta do servidor
const PORT = process.env.PORT || 3000;

// Conecta ao banco de dados e inicia o servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
  });
}).catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});

module.exports = app;
