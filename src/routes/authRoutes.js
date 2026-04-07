const express = require('express');
const AuthCadastroLoginController = require('../controllers/authCadastroLoginController');

const router = express.Router();

router.post('/signup', (req, res) => AuthCadastroLoginController.signup(req, res));
router.post('/login', (req, res) => AuthCadastroLoginController.login(req, res));
router.post('/verificar-codigo', (req, res) => AuthCadastroLoginController.verificarCodigo(req, res));
router.get('/perfil', (req, res) => AuthCadastroLoginController.obterPerfil(req, res));

module.exports = router;
