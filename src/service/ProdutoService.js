const ProdutoModel = require('../models/ProdutoModel');

class ProdutoService {
  async listarTodos() {
    return ProdutoModel.listarTodos();
  }

  async buscarPorId(id) {
    const produto = await ProdutoModel.buscarPorId(id);
    if (!produto) throw new Error('Produto não encontrado');
    return produto;
  }

  async criar(dados) {
    if (!dados.nome || !dados.preco || !dados.categoria) {
      throw new Error('nome, preco e categoria são obrigatórios');
    }
    return ProdutoModel.criar(dados);
  }

  async atualizar(id, dados) {
    await this.buscarPorId(id); // valida existência
    return ProdutoModel.atualizar(id, dados);
  }

  async atualizarEstoque(id, delta) {
    if (delta === 0) throw new Error('Delta não pode ser zero');
    await this.buscarPorId(id);
    return ProdutoModel.atualizarEstoque(id, delta);
  }

  async toggleDestaque(id) {
    await this.buscarPorId(id);
    return ProdutoModel.toggleDestaque(id);
  }

  async deletar(id) {
    await this.buscarPorId(id);
    return ProdutoModel.deletar(id);
  }
}

module.exports = new ProdutoService();
