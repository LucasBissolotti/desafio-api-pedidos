# API de Gerenciamento de Pedidos

API REST desenvolvida em Node.js com Express e MongoDB para gerenciar pedidos (CRUD completo).

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **Swagger** - Documentação interativa da API

## Estrutura do Projeto

```
Desafio/
├── src/
│   ├── config/
│   │   ├── database.js       # Configuração de conexão com MongoDB
│   │   └── swagger.js        # Configuração do Swagger
│   ├── controllers/
│   │   ├── authController.js # Controller de autenticação
│   │   └── orderController.js# Controller de pedidos
│   ├── middlewares/
│   │   └── auth.js           # Middleware de autenticação JWT
│   ├── models/
│   │   └── Order.js          # Model do pedido (Mongoose)
│   ├── routes/
│   │   ├── authRoutes.js     # Rotas de autenticação
│   │   └── orderRoutes.js    # Rotas de pedidos
│   ├── utils/
│   │   └── orderMapper.js    # Mapeamento/transformação dos dados
│   └── server.js             # Arquivo principal do servidor
├── .env                      # Variáveis de ambiente
├── .env.example              # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/)

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Desafio
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/desafioPedidos
JWT_SECRET=sua_chave_secreta_jwt_aqui
```

4. Inicie o servidor:
```bash
# Modo produção
npm start

# Modo desenvolvimento (com hot-reload)
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

## Documentação da API

A documentação interativa (Swagger) está disponível em:
```
http://localhost:3000/api-docs
```

## Endpoints

### Autenticação

| Método | Rota          | Descrição                  |
|--------|---------------|----------------------------|
| POST   | /auth/login   | Gera um token JWT          |

**Credenciais de teste:** `username: admin` / `password: admin`

### Pedidos (requerem autenticação JWT)

| Método | Rota              | Descrição                          |
|--------|-------------------|------------------------------------|
| POST   | /order            | Cria um novo pedido                |
| GET    | /order/list       | Lista todos os pedidos             |
| GET    | /order/:orderId   | Obtém um pedido pelo número        |
| PUT    | /order/:orderId   | Atualiza um pedido pelo número     |
| DELETE | /order/:orderId   | Deleta um pedido pelo número       |

## Exemplos de Uso

### 1. Obter token de autenticação

```bash
curl --location 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "admin",
    "password": "admin"
}'
```

**Resposta:**
```json
{
    "message": "Login realizado com sucesso",
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Criar um pedido

```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <SEU_TOKEN>' \
--data '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
        {
            "idItem": "2434",
            "quantidadeItem": 1,
            "valorItem": 1000
        }
    ]
}'
```

**Resposta (201):**
```json
{
    "message": "Pedido criado com sucesso",
    "order": {
        "orderId": "v10089015vdb-01",
        "value": 10000,
        "creationDate": "2023-07-19T12:24:11.529Z",
        "items": [
            {
                "productId": 2434,
                "quantity": 1,
                "price": 1000
            }
        ]
    }
}
```

### 3. Buscar pedido por número

```bash
curl --location 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Authorization: Bearer <SEU_TOKEN>'
```

### 4. Listar todos os pedidos

```bash
curl --location 'http://localhost:3000/order/list' \
--header 'Authorization: Bearer <SEU_TOKEN>'
```

### 5. Atualizar pedido

```bash
curl --location --request PUT 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <SEU_TOKEN>' \
--data '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 15000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
        {
            "idItem": "2434",
            "quantidadeItem": 2,
            "valorItem": 7500
        }
    ]
}'
```

### 6. Deletar pedido

```bash
curl --location --request DELETE 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Authorization: Bearer <SEU_TOKEN>'
```

## Transformação de Dados (Mapping)

A API recebe os dados no formato PT-BR e transforma para EN antes de salvar no banco:

| Campo Recebido (PT-BR) | Campo Salvo (EN) |
|-------------------------|------------------|
| numeroPedido            | orderId          |
| valorTotal              | value            |
| dataCriacao             | creationDate     |
| items[].idItem          | items[].productId|
| items[].quantidadeItem  | items[].quantity |
| items[].valorItem       | items[].price    |

## Tratamento de Erros

A API retorna códigos HTTP apropriados:

| Código | Descrição                                      |
|--------|-------------------------------------------------|
| 200    | Operação realizada com sucesso                  |
| 201    | Recurso criado com sucesso                      |
| 400    | Dados inválidos na requisição                   |
| 401    | Não autorizado (token ausente/inválido/expirado)|
| 404    | Recurso não encontrado                          |
| 409    | Conflito (pedido já existe)                     |
| 500    | Erro interno do servidor                        |
