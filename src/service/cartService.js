const pool = require("../configs/database_config");
const CartModel = require("../models/CartModel");

class CartService {
  static _calcularTotal(items) {
    return items.reduce(
      (total, item) => total + item.quantidade * item.preco_unitario,
      0,
    );
  }

  static _normalizarItens(itens) {
    if (!itens) return [];
    if (typeof itens === "string") {
      try {
        return JSON.parse(itens);
      } catch {
        return [];
      }
    }
    return Array.isArray(itens) ? itens : [];
  }

  static async buscarCarrinhoDoUsuario(userId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM carrinhos WHERE usuario_id = ?",
        [userId],
      );
      if (rows.length === 0) return null;
      const carrinho = rows[0];
      const items = CartService._normalizarItens(carrinho.itens);
      return new CartModel(
        carrinho.id,
        carrinho.usuario_id,
        items,
        carrinho.total,
        carrinho.data_criacao,
        carrinho.data_atualizacao,
      );
    } finally {
      connection.release();
    }
  }

  static async criarOuBuscarCarrinho(userId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM carrinhos WHERE usuario_id = ?",
        [userId],
      );
      if (rows.length > 0) {
        return rows[0];
      }

      const [result] = await connection.query(
        "INSERT INTO carrinhos (usuario_id, itens, total, data_criacao, data_atualizacao) VALUES (?, JSON_ARRAY(), 0, NOW(), NOW())",
        [userId],
      );
      return {
        id: result.insertId,
        usuario_id: userId,
        itens: [],
        total: 0,
      };
    } finally {
      connection.release();
    }
  }

  static async _salvarCarrinho(carrinhoId, userId, items) {
    const total = CartService._calcularTotal(items);
    const connection = await pool.getConnection();
    try {
      await connection.query(
        "UPDATE carrinhos SET itens = ?, total = ?, data_atualizacao = NOW() WHERE id = ? AND usuario_id = ?",
        [JSON.stringify(items), total, carrinhoId, userId],
      );
      return new CartModel(carrinhoId, userId, items, total);
    } finally {
      connection.release();
    }
  }

  static _encontrarItem(items, produtoId) {
    return items.find((item) => item.produtoId === produtoId);
  }

  static async adicionarItem(userId, itemData) {
    const { produtoId, nome, quantidade, preco_unitario } = itemData;
    if (!produtoId || !nome || !quantidade || !preco_unitario) {
      throw new Error("Os dados do item são obrigatórios.");
    }

    const carrinho = await CartService.criarOuBuscarCarrinho(userId);
    const items = CartService._normalizarItens(carrinho.itens);
    const itemExistente = CartService._encontrarItem(items, produtoId);

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      items.push({ produtoId, nome, quantidade, preco_unitario });
    }

    return await CartService._salvarCarrinho(carrinho.id, userId, items);
  }

  static async atualizarItem(userId, produtoId, quantidade) {
    if (!produtoId || quantidade == null) {
      throw new Error("Produto e quantidade são obrigatórios.");
    }

    const carrinho = await CartService.buscarCarrinhoDoUsuario(userId);
    if (!carrinho) throw new Error("Carrinho não encontrado.");

    const item = CartService._encontrarItem(carrinho.items, produtoId);
    if (!item) throw new Error("Item não encontrado no carrinho.");
    if (quantidade < 1) {
      return await CartService.removerItem(userId, produtoId);
    }

    item.quantidade = quantidade;
    return await CartService._salvarCarrinho(carrinho.id, userId, carrinho.items);
  }

  static async removerItem(userId, produtoId) {
    if (!produtoId) throw new Error("Produto é obrigatório.");

    const carrinho = await CartService.buscarCarrinhoDoUsuario(userId);
    if (!carrinho) throw new Error("Carrinho não encontrado.");

    const items = carrinho.items.filter(
      (item) => item.produtoId !== produtoId,
    );

    return await CartService._salvarCarrinho(carrinho.id, userId, items);
  }

  static async limparCarrinho(userId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT id FROM carrinhos WHERE usuario_id = ?",
        [userId],
      );
      if (rows.length === 0) {
        return new CartModel(null, userId, [], 0);
      }
      const carrinhoId = rows[0].id;
      await connection.query(
        "UPDATE carrinhos SET itens = JSON_ARRAY(), total = 0, data_atualizacao = NOW() WHERE id = ?",
        [carrinhoId],
      );
      return new CartModel(carrinhoId, userId, [], 0);
    } finally {
      connection.release();
    }
  }

  static async checkout(userId) {
    const cart = await CartService.buscarCarrinhoDoUsuario(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error("Carrinho vazio. Adicione itens antes de finalizar a compra.");
    }
    return {
      success: true,
      message: "Checkout simulado. Implemente a integração com pagamento e pedidos.",
      cart,
    };
  }
}

module.exports = CartService;
