const pool = require('../configs/database_config')
const bcrypt = require('bcryptjs');

class UserModel {
    constructor(id = null,
    nome = '',
    email = '',
    senha = '',
    telefone = '',
    foto_perfil = null,
    email_verificado = 0,
    token_verificacao = null,
    data_criacao = null,
    data_atualizacao = null) {
    
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.telefone = telefone;
    this.fotoPerfil = foto_perfil; 
    this.emailVerificado = email_verificado;
    this.tokenVerificacao = token_verificacao;
    this.dataCriacao = data_criacao;
    this.dataAtualizacao = data_atualizacao;
}
}




module.exports = UserModel;