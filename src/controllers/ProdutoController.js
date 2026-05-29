const ProdutoService = require('../service/ProdutoService');

class ProdutoController {
  async listarTodos(req, res) {
    try {
      const produtos = await ProdutoService.listarTodos();
      res.json({ success: true, produtos });
    } catch (err) {
      res.status(500).json({ success: false, erro: err.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const produto = await ProdutoService.buscarPorId(req.params.id);
      res.json({ success: true, produto });
    } catch (err) {
      res.status(404).json({ success: false, erro: err.message });
    }
  }

  async criar(req, res) {
    try {
      const produto = await ProdutoService.criar(req.body);
      res.status(201).json({ success: true, produto });
    } catch (err) {
      res.status(400).json({ success: false, erro: err.message });
    }
  }

  async atualizar(req, res) {
    try {
      const produto = await ProdutoService.atualizar(req.params.id, req.body);
      res.json({ success: true, produto });
    } catch (err) {
      res.status(400).json({ success: false, erro: err.message });
    }
  }

  async atualizarEstoque(req, res) {
    try {
      const { delta } = req.body;
      if (delta === undefined || isNaN(Number(delta))) {
        return res.status(400).json({ success: false, erro: 'Campo "delta" numérico é obrigatório' });
      }
      const produto = await ProdutoService.atualizarEstoque(req.params.id, Number(delta));
      res.json({ success: true, produto });
    } catch (err) {
      res.status(400).json({ success: false, erro: err.message });
    }
  }

  async toggleDestaque(req, res) {
    try {
      const produto = await ProdutoService.toggleDestaque(req.params.id);
      res.json({ success: true, produto });
    } catch (err) {
      res.status(400).json({ success: false, erro: err.message });
    }
  }

  async deletar(req, res) {
    try {
      await ProdutoService.deletar(req.params.id);
      res.json({ success: true, mensagem: 'Produto removido com sucesso' });
    } catch (err) {
      res.status(400).json({ success: false, erro: err.message });
    }
  }
}

module.exports = new ProdutoController();
