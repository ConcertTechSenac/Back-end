// service/authCadastroLoginService.js
const pool = require("../configs/database_config");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const { sendVerifyEmail } = require("../configs/email_config");
const {
  generateAcessToken,
  generateToken,
} = require("../utils/Token_generation");

class AuthCadastroLoginService {
  static _rowToModel(user) {
    return new UserModel(
      user.id,
      user.nome,
      user.email,
      user.senha,
      user.telefone,
      user.foto_perfil,
      user.email_verificado,
      user.token_verificacao,
      user.data_criacao,
      user.data_atualizacao,
    );
  }

  static async buscarPorEmail(email) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
      );
      connection.release();
      if (rows.length === 0) return null;
      return AuthCadastroLoginService._rowToModel(rows[0]);
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM usuarios WHERE id = ?",
        [id],
      );
      connection.release();
      if (rows.length === 0) throw new Error("Usuário não encontrado.");
      const user = rows[0];
      return new UserModel(
        user.id,
        user.nome,
        user.email,
        "Senha não pode ser retornada",
        user.telefone,
        user.foto_perfil,
        user.email_verificado,
        null,
        user.data_criacao,
        user.data_atualizacao,
      );
    } catch (error) {
      console.error("Erro ao buscar usuário por id:", error);
      throw error;
    }
  }

  static async listarTodos() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query("SELECT * FROM usuarios");
      connection.release();
      return rows;
    } catch (error) {
      console.error("Erro ao listar usuarios:", error);
      throw error;
    }
  }

  static async deletar(id) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        "DELETE FROM usuarios WHERE id = ?",
        [id],
      );
      connection.release();
      if (result.affectedRows === 0) throw new Error("Usuário não encontrado.");
      return { success: true, message: "Usuário deletado com sucesso!" };
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }

  static async atualizar(id, dadosAtualizados) {
    try {
      const { nome, telefone, foto_perfil } = dadosAtualizados;
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        `UPDATE usuarios 
         SET nome = COALESCE(?, nome), 
             telefone = COALESCE(?, telefone), 
             foto_perfil = COALESCE(?, foto_perfil), 
             data_atualizacao = NOW() 
         WHERE id = ?`,
        [nome, telefone, foto_perfil, id],
      );
      connection.release();
      if (result.affectedRows === 0) throw new Error("Usuário não encontrado.");
      return { success: true, message: "Dados atualizados com sucesso!" };
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  static validarCadastro(nome, email, senha) {
    const erros = [];
    if (!nome || nome.trim() === "") erros.push("O nome é obrigatório.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === "") erros.push("O email é obrigatório.");
    else if (!emailRegex.test(email)) erros.push("O email deve ser válido.");
    if (!senha || senha.trim() === "") erros.push("A senha é obrigatória.");
    else if (senha.length < 6)
      erros.push("A senha deve ter pelo menos 6 caracteres.");
    if (erros.length > 0) throw new Error(erros.join(", "));
  }

  static async cadastrar(nome, email, senha, telefone) {
    try {
      AuthCadastroLoginService.validarCadastro(nome, email, senha);
      const existente = await AuthCadastroLoginService.buscarPorEmail(email);
      if (existente)
        throw new Error("Email já cadastrado. Por favor, use outro email.");

      const senhaHash = await bcrypt.hash(senha, 10);
      const token = generateToken();

      const connection = await pool.getConnection();
      const [result] = await connection.query(
        "INSERT INTO usuarios (nome, email, senha, telefone, token_verificacao) VALUES (?, ?, ?, ?, ?)",
        [nome, email, senhaHash, telefone, token],
      );
      connection.release();

      await sendVerifyEmail(email, token);

      return {
        success: true,
        message:
          "Usuário cadastrado com sucesso! Por favor, verifique seu email.",
        userid: result.insertId,
        email,
      };
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      throw error;
    }
  }

  static async login(email, senha) {
    try {
      if (!email || !senha) throw new Error("Email e senha são obrigatórios.");
      const usuario = await AuthCadastroLoginService.buscarPorEmail(email);
      if (!usuario) throw new Error("Email ou senha inválidos.");
      if (usuario.emailVerificado == 0) {
        throw new Error(
          "Email não verificado. Verifique seu email antes de fazer login.",
        );
      }
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) throw new Error("Email ou senha inválidos.");

      const acessToken = generateAcessToken(usuario.id);
      return {
        success: true,
        message: "Login realizado com sucesso!",
        token: acessToken,
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          fotoPerfil: usuario.fotoPerfil,
        },
      };
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      throw error;
    }
  }

  // ── Login Admin ──────────────────────────────────────────────────────────────
  static async loginAdmin(usuario, senha) {
    try {
      if (!usuario || !senha)
        throw new Error("Usuário e senha são obrigatórios.");

      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM admins WHERE usuario = ?",
        [usuario],
      );
      connection.release();

      if (rows.length === 0) throw new Error("Usuário ou senha inválidos.");

      const admin = rows[0];
      const senhaValida = await bcrypt.compare(senha, admin.senha);
      if (!senhaValida) throw new Error("Usuário ou senha inválidos.");

      return {
        success: true,
        message: "Login admin realizado com sucesso!",
        admin: { id: admin.id, usuario: admin.usuario },
      };
    } catch (error) {
      console.error("Erro ao realizar login admin:", error);
      throw error;
    }
  }

  static async verificarCodigo(email, otp) {
    try {
      const usuario = await AuthCadastroLoginService.buscarPorEmail(email);
      if (!usuario) throw new Error("Usuário não encontrado.");
      if (usuario.emailVerificado == 1) {
        throw new Error(
          "Este email já foi verificado. Você já pode fazer login!",
        );
      }
      if (usuario.tokenVerificacao !== String(otp)) {
        throw new Error("Código de verificação inválido.");
      }

      const connection = await pool.getConnection();
      await connection.query(
        "UPDATE usuarios SET email_verificado = 1, token_verificacao = NULL, data_atualizacao = NOW() WHERE email = ?",
        [email],
      );
      connection.release();

      return {
        success: true,
        message: "Email verificado com sucesso! Seu cadastro está completo.",
      };
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      throw error;
    }
  }
}

module.exports = AuthCadastroLoginService;
