const Order = require('../models/Order');
const { mapOrderInput, mapOrderOutput } = require('../utils/orderMapper');

/**
 * Controller responsável pelas operações CRUD de pedidos.
 */

/**
 * Cria um novo pedido.
 * Recebe os dados no formato PT-BR, transforma para EN e salva no banco.
 * 
 * POST /order
 */
const createOrder = async (req, res) => {
  try {
    // Mapeia os dados do body (PT-BR) para o formato do banco (EN)
    const mappedData = mapOrderInput(req.body);

    // Verifica se já existe um pedido com o mesmo orderId
    const existingOrder = await Order.findOne({ orderId: mappedData.orderId });
    if (existingOrder) {
      return res.status(409).json({
        error: 'Conflito',
        message: `Já existe um pedido com o número "${mappedData.orderId}"`
      });
    }

    // Cria o pedido no banco de dados
    const order = await Order.create(mappedData);

    // Retorna o pedido criado no formato de saída
    return res.status(201).json({
      message: 'Pedido criado com sucesso',
      order: mapOrderOutput(order)
    });
  } catch (error) {
    // Erro de validação do mapper ou do Mongoose
    if (error.message.includes('obrigatório') || error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: error.message
      });
    }

    // Erro interno do servidor
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao criar o pedido'
    });
  }
};

/**
 * Obtém um pedido pelo número (orderId).
 * 
 * GET /order/:orderId
 */
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Busca o pedido pelo orderId
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: `Pedido "${orderId}" não encontrado`
      });
    }

    return res.status(200).json(mapOrderOutput(order));
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao buscar o pedido'
    });
  }
};

/**
 * Lista todos os pedidos.
 * 
 * GET /order/list
 */
const listOrders = async (req, res) => {
  try {
    // Busca todos os pedidos, ordenados pela data de criação (mais recente primeiro)
    const orders = await Order.find().sort({ creationDate: -1 });

    // Mapeia todos os pedidos para o formato de saída
    const mappedOrders = orders.map(mapOrderOutput);

    return res.status(200).json({
      total: mappedOrders.length,
      orders: mappedOrders
    });
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao listar os pedidos'
    });
  }
};

/**
 * Atualiza um pedido pelo número (orderId).
 * 
 * PUT /order/:orderId
 */
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verifica se o pedido existe
    const existingOrder = await Order.findOne({ orderId });
    if (!existingOrder) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: `Pedido "${orderId}" não encontrado`
      });
    }

    // Mapeia os novos dados do body
    const mappedData = mapOrderInput(req.body);

    // Atualiza o pedido no banco de dados
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      mappedData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: 'Pedido atualizado com sucesso',
      order: mapOrderOutput(updatedOrder)
    });
  } catch (error) {
    if (error.message.includes('obrigatório') || error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: error.message
      });
    }

    console.error('Erro ao atualizar pedido:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao atualizar o pedido'
    });
  }
};

/**
 * Deleta um pedido pelo número (orderId).
 * 
 * DELETE /order/:orderId
 */
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Busca e remove o pedido
    const deletedOrder = await Order.findOneAndDelete({ orderId });

    if (!deletedOrder) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: `Pedido "${orderId}" não encontrado`
      });
    }

    return res.status(200).json({
      message: `Pedido "${orderId}" deletado com sucesso`
    });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro ao deletar o pedido'
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder
};
