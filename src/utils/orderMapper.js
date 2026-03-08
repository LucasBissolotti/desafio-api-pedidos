/**
 * Módulo de mapeamento (transformação) dos dados do pedido.
 * 
 * Converte os campos recebidos no body da requisição (em português)
 * para o formato esperado pelo banco de dados (em inglês).
 * 
 * Entrada (body da requisição):
 *   numeroPedido -> orderId
 *   valorTotal   -> value
 *   dataCriacao  -> creationDate
 *   items[].idItem         -> items[].productId
 *   items[].quantidadeItem -> items[].quantity
 *   items[].valorItem      -> items[].price
 */

/**
 * Transforma os dados do pedido recebidos no formato PT-BR
 * para o formato EN usado no banco de dados.
 * 
 * @param {Object} requestBody - Corpo da requisição com campos em português.
 * @returns {Object} Dados mapeados para o formato do banco de dados.
 * @throws {Error} Caso campos obrigatórios estejam ausentes.
 */
const mapOrderInput = (requestBody) => {
  const { numeroPedido, valorTotal, dataCriacao, items } = requestBody;

  // Validação dos campos obrigatórios
  if (!numeroPedido) {
    throw new Error('O campo "numeroPedido" é obrigatório');
  }

  if (valorTotal === undefined || valorTotal === null) {
    throw new Error('O campo "valorTotal" é obrigatório');
  }

  if (!dataCriacao) {
    throw new Error('O campo "dataCriacao" é obrigatório');
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('O campo "items" é obrigatório e deve conter pelo menos um item');
  }

  // Mapeamento dos itens
  const mappedItems = items.map((item, index) => {
    if (!item.idItem) {
      throw new Error(`O campo "idItem" é obrigatório no item ${index + 1}`);
    }

    if (item.quantidadeItem === undefined || item.quantidadeItem === null) {
      throw new Error(`O campo "quantidadeItem" é obrigatório no item ${index + 1}`);
    }

    if (item.valorItem === undefined || item.valorItem === null) {
      throw new Error(`O campo "valorItem" é obrigatório no item ${index + 1}`);
    }

    return {
      productId: parseInt(item.idItem, 10),
      quantity: item.quantidadeItem,
      price: item.valorItem
    };
  });

  // Retorna o objeto mapeado
  return {
    orderId: numeroPedido,
    value: valorTotal,
    creationDate: new Date(dataCriacao),
    items: mappedItems
  };
};

/**
 * Transforma os dados do pedido do formato do banco de dados (EN)
 * de volta para o formato PT-BR da resposta.
 * 
 * @param {Object} order - Documento do pedido no banco de dados.
 * @returns {Object} Dados no formato de resposta.
 */
const mapOrderOutput = (order) => {
  return {
    orderId: order.orderId,
    value: order.value,
    creationDate: order.creationDate,
    items: order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }))
  };
};

module.exports = {
  mapOrderInput,
  mapOrderOutput
};
