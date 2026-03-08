const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuração do Swagger para documentação da API.
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Pedidos',
      version: '1.0.0',
      description: 'API REST para criar, ler, atualizar e deletar pedidos.',
      contact: {
        name: 'Desafio API'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no endpoint /auth/login'
        }
      },
      schemas: {
        OrderInput: {
          type: 'object',
          required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
          properties: {
            numeroPedido: {
              type: 'string',
              description: 'Número identificador do pedido',
              example: 'v10089015vdb-01'
            },
            valorTotal: {
              type: 'number',
              description: 'Valor total do pedido',
              example: 10000
            },
            dataCriacao: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do pedido',
              example: '2023-07-19T12:24:11.5299601+00:00'
            },
            items: {
              type: 'array',
              description: 'Lista de itens do pedido',
              items: {
                type: 'object',
                required: ['idItem', 'quantidadeItem', 'valorItem'],
                properties: {
                  idItem: {
                    type: 'string',
                    description: 'ID do item/produto',
                    example: '2434'
                  },
                  quantidadeItem: {
                    type: 'integer',
                    description: 'Quantidade do item',
                    example: 1
                  },
                  valorItem: {
                    type: 'number',
                    description: 'Valor unitário do item',
                    example: 1000
                  }
                }
              }
            }
          }
        },
        OrderResponse: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'Identificador do pedido (mapeado de numeroPedido)',
              example: 'v10089016vdb'
            },
            value: {
              type: 'number',
              description: 'Valor total do pedido (mapeado de valorTotal)',
              example: 10000
            },
            creationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação (mapeado de dataCriacao)',
              example: '2023-07-19T12:24:11.529Z'
            },
            items: {
              type: 'array',
              description: 'Lista de itens do pedido',
              items: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'integer',
                    description: 'ID do produto (mapeado de idItem)',
                    example: 2434
                  },
                  quantity: {
                    type: 'integer',
                    description: 'Quantidade (mapeado de quantidadeItem)',
                    example: 1
                  },
                  price: {
                    type: 'number',
                    description: 'Preço unitário (mapeado de valorItem)',
                    example: 1000
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
