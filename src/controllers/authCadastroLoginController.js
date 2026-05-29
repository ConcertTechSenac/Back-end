// controllers/authCadastroLoginController.js
const AuthCadastroLoginService = require("../service/authCadastroLoginService");

class AuthController {
  async signup(req, res) {
    try {
      const { nome, email, senha, telefone } = req.body;
      if (!nome || !email || !senha) {
        return res
          .status(400)
          .json({
            success: false,
            erro: "Nome, email e senha são obrigatórios",
          });
      }
      const resultado = await AuthCadastroLoginService.cadastrar(
        nome,
        email,
        senha,
        telefone,
      );
      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({ success: false, erro: error.message });
    }
  }

  async verificarCodigo(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res
          .status(400)
          .json({ success: false, erro: "Email e código são obrigatórios" });
      }
      const resultado = await AuthCadastroLoginService.verificarCodigo(
        email,
        otp,
      );
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({ success: false, erro: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res
          .status(400)
          .json({ success: false, erro: "Email e senha são obrigatórios" });
      }
      const resultado = await AuthCadastroLoginService.login(email, senha);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ success: false, erro: error.message });
    }
  }

  // ── Login Admin ──────────────────────────────────────────────────────────────
  async loginAdmin(req, res) {
    try {
      const { usuario, senha } = req.body;
      if (!usuario || !senha) {
        return res
          .status(400)
          .json({ success: false, erro: "Usuário e senha são obrigatórios" });
      }
      const resultado = await AuthCadastroLoginService.loginAdmin(
        usuario,
        senha,
      );
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ success: false, erro: error.message });
    }
  }

  async obterPerfil(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, erro: "Usuário não autenticado" });
      }
      const usuario = await AuthCadastroLoginService.buscarPorId(userId);
      if (!usuario) {
        return res
          .status(404)
          .json({ success: false, erro: "Usuário não encontrado" });
      }
      res.status(200).json({ success: true, usuario });
    } catch (error) {
      res.status(500).json({ success: false, erro: error.message });
    }
  }

  async listarTodos(req, res) {
    try {
      const usuarios = await AuthCadastroLoginService.listarTodos();
      res.status(200).json({ success: true, usuarios });
    } catch (error) {
      res.status(500).json({ success: false, erro: error.message });
    }
  }

  async atualizarPerfil(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, erro: "Usuário não autenticado" });
      }
      const { nome, telefone, foto_perfil } = req.body;
      const resultado = await AuthCadastroLoginService.atualizar(userId, {
        nome,
        telefone,
        foto_perfil,
      });
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({ success: false, erro: error.message });
    }
  }

  async deletarUsuario(req, res) {
    try {
      const idParaDeletar = req.params.id;
      if (!idParaDeletar) {
        return res
          .status(400)
          .json({ success: false, erro: "ID do usuário não fornecido" });
      }
      const resultado = await AuthCadastroLoginService.deletar(idParaDeletar);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({ success: false, erro: error.message });
    }
  }
}

module.exports = new AuthController();
