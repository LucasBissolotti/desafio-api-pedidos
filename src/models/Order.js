const mongoose = require('mongoose');

/**
 * Schema do item do pedido.
 * Cada item possui um productId, quantity e price.
 */
const itemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: [true, 'O productId é obrigatório']
  },
  quantity: {
    type: Number,
    required: [true, 'A quantity é obrigatória'],
    min: [1, 'A quantity deve ser no mínimo 1']
  },
  price: {
    type: Number,
    required: [true, 'O price é obrigatório'],
    min: [0, 'O price não pode ser negativo']
  }
}, { _id: false });

/**
 * Schema do pedido.
 * Armazena os dados já transformados (mapeados) do pedido.
 * 
 * Campos:
 * - orderId: identificador único do pedido
 * - value: valor total do pedido
 * - creationDate: data de criação do pedido
 * - items: array de itens do pedido
 */
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'O orderId é obrigatório'],
    unique: true,
    trim: true
  },
  value: {
    type: Number,
    required: [true, 'O value é obrigatório'],
    min: [0, 'O value não pode ser negativo']
  },
  creationDate: {
    type: Date,
    required: [true, 'A creationDate é obrigatória']
  },
  items: {
    type: [itemSchema],
    required: [true, 'Os items são obrigatórios'],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'O pedido deve conter pelo menos um item'
    }
  }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  versionKey: false
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
