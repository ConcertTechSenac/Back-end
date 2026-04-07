const AuthCadastroLoginService = require('../service/authCadastroLoginService');

class AuthController {
  
  async signup(req, res) {
    try {
      const { nome, email, senha, telefone } = req.body;

      // Validar se os campos obrigatórios foram enviados
      if (!nome || !email || !senha) {
        return res.status(400).json({
          success: false,
          erro: 'Nome, email e senha são obrigatórios',
        });
      }

      const resultado = await AuthCadastroLoginService.cadastrar(nome, email, senha, telefone);
      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({
        success: false,
        erro: error.message,
      });
    }
  }

  // ============ VERIFICAR CÓDIGO ============
  async verificarCodigo(req, res) {
    try {
      const { email, otp } = req.body;

      // Validar se os campos foram enviados
      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          erro: 'Email e código são obrigatórios',
        });
      }

      const resultado = await AuthCadastroLoginService.verificarCodigo(email, otp);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        success: false,
        erro: error.message,
      });
    }
  }

  // ============ LOGIN ============
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Validar se os campos foram enviados
      if (!email || !senha) {
        return res.status(400).json({
          success: false,
          erro: 'Email e senha são obrigatórios',
        });
      }

      const resultado = await AuthCadastroLoginService.login(email, senha);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({
        success: false,
        erro: error.message,
      });
    }
  }

  
  async obterPerfil(req, res) {
    try {
      const userId = req.userId; 

      if (!userId) {
        return res.status(401).json({
          success: false,
          erro: 'Usuário não autenticado',
        });
      }

      const usuario = await AuthCadastroLoginService.buscarPorId(userId);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          erro: 'Usuário não encontrado',
        });
      }

      res.status(200).json({
        success: true,
        usuario: usuario.toJSON(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        erro: error.message,
      });
    }
  }
}

module.exports = new AuthController();