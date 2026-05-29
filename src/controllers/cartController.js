const CartService = require("../service/cartService");

class CartController {
  async obterCarrinho(req, res) {
    try {
      const userId = req.userId;
      const carrinho = await CartService.buscarCarrinhoDoUsuario(userId);
      res.status(200).json({ success: true, carrinho: carrinho || { items: [], total: 0 } });
    } catch (error) {
      res.status(500).json({ success: false, erro: error.message });
    }
  }

  async adicionarItem(req, res) {
    try {
      const userId = req.userId;
      const { produtoId, nome, quantidade, preco_unitario } = req.body;
      const carrinho = await CartService.adicionarItem(userId, {
        produtoId,
        nome,
        quantidade,
        preco_unitario,
      });
      res.status(201).json({ success: true, carrinho });
    } catch (error) {
      res.status(400).json({ success: false, erro: error.message });
    }
  }

  async atualizarItem(req, res) {
    try {
      const userId = req.userId;
      const produtoId = Number(req.params.produtoId);
      const { quantidade } = req.body;
      const carrinho = await CartService.atualizarItem(userId, produtoId, quantidade);
      res.status(200).json({ success: true, carrinho });
    } catch (error) {
      res.status(400).json({ success: false, erro: error.message });
    }
  }

  async removerItem(req, res) {
    try {
      const userId = req.userId;
      const produtoId = Number(req.params.produtoId);
      const carrinho = await CartService.removerItem(userId, produtoId);
      res.status(200).json({ success: true, carrinho });
    } catch (error) {
      res.status(400).json({ success: false, erro: error.message });
    }
  }

  async limparCarrinho(req, res) {
    try {
      const userId = req.userId;
      const carrinho = await CartService.limparCarrinho(userId);
      res.status(200).json({ success: true, carrinho });
    } catch (error) {
      res.status(400).json({ success: false, erro: error.message });
    }
  }

  async checkout(req, res) {
    try {
      const userId = req.userId;
      const resultado = await CartService.checkout(userId);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({ success: false, erro: error.message });
    }
  }
}

module.exports = new CartController();
