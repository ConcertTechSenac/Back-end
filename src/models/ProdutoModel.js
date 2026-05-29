const pool = require('../configs/database_config');

class ProdutoModel {
  // Mapeia linha do banco para o formato esperado pelo front-end
  static _mapear(row) {
    return {
      id:            row.id,
      nome:          row.nome,
      nomeShort:     row.nome_short,
      descricao:     row.descricao,
      preco:         parseFloat(row.preco),
      precoOriginal: row.preco_original ? parseFloat(row.preco_original) : null,
      categoria:     row.categoria,
      avaliacao:     parseFloat(row.avaliacao),
      avaliacoes:    row.avaliacoes,
      estoque:       row.estoque,
      imagem:        row.imagem,
      cor:           row.cor,
      destaque:      row.destaque === 1,
    };
  }

  static async listarTodos() {
    const [rows] = await pool.query('SELECT * FROM produtos ORDER BY id ASC');
    return rows.map(ProdutoModel._mapear);
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query('SELECT * FROM produtos WHERE id = ?', [id]);
    return rows.length ? ProdutoModel._mapear(rows[0]) : null;
  }

  static async criar(dados) {
    const { nome, nomeShort, descricao, preco, precoOriginal, categoria,
            avaliacao, avaliacoes, estoque, imagem, cor, destaque } = dados;
    const [result] = await pool.query(
      `INSERT INTO produtos
        (nome, nome_short, descricao, preco, preco_original, categoria, avaliacao, avaliacoes, estoque, imagem, cor, destaque)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, nomeShort ?? nome, descricao ?? null,
       preco, precoOriginal ?? null, categoria,
       avaliacao ?? 5.0, avaliacoes ?? 0, estoque ?? 0,
       imagem ?? null, cor ?? '#282b75', destaque ? 1 : 0]
    );
    return ProdutoModel.buscarPorId(result.insertId);
  }

  static async atualizar(id, dados) {
    const campos = [];
    const valores = [];

    const mapa = {
      nome, nomeShort: 'nome_short', descricao,
      preco, precoOriginal: 'preco_original', categoria,
      avaliacao, avaliacoes, estoque, imagem, cor, destaque,
    };

    // Constrói SET dinâmico apenas com campos enviados
    const colunasDB = {
      nome: 'nome', nomeShort: 'nome_short', descricao: 'descricao',
      preco: 'preco', precoOriginal: 'preco_original', categoria: 'categoria',
      avaliacao: 'avaliacao', avaliacoes: 'avaliacoes', estoque: 'estoque',
      imagem: 'imagem', cor: 'cor', destaque: 'destaque',
    };

    for (const [chave, coluna] of Object.entries(colunasDB)) {
      if (dados[chave] !== undefined) {
        campos.push(`${coluna} = ?`);
        valores.push(chave === 'destaque' ? (dados[chave] ? 1 : 0) : dados[chave]);
      }
    }

    if (campos.length === 0) return ProdutoModel.buscarPorId(id);

    valores.push(id);
    await pool.query(`UPDATE produtos SET ${campos.join(', ')} WHERE id = ?`, valores);
    return ProdutoModel.buscarPorId(id);
  }

  static async toggleDestaque(id) {
    await pool.query('UPDATE produtos SET destaque = NOT destaque WHERE id = ?', [id]);
    return ProdutoModel.buscarPorId(id);
  }

  static async deletar(id) {
    const [result] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = ProdutoModel;
