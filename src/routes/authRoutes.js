const express = require('express');
const AuthCadastroLoginController = require('../controllers/authCadastroLoginController');

const router = express.Router();

router.post('/signup', AuthCadastroLoginController.signup);
router.post('/login', AuthCadastroLoginController.login);
router.post('/verificar-codigo', AuthCadastroLoginController.verificarCodigo);


router.get('/perfil', AuthCadastroLoginController.obterPerfil);
router.get('/usuarios', AuthCadastroLoginController.listarTodos);
router.put('/perfil', AuthCadastroLoginController.atualizarPerfil);
router.delete('/usuarios/:id', AuthCadastroLoginController.deletarUsuario);

module.exports = router;