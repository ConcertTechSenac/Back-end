// routes/authRoutes.js
const express = require("express");
const AuthCadastroLoginController = require("../controllers/authCadastroLoginController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ── Rotas públicas ────────────────────────────────────────────────────────────
router.post("/signup", AuthCadastroLoginController.signup);
router.post("/login", AuthCadastroLoginController.login);
router.post("/verificar-codigo", AuthCadastroLoginController.verificarCodigo);
router.post("/login-admin", AuthCadastroLoginController.loginAdmin); // ← nova rota

// ── Rotas públicas do dashboard ───────────────────────────────────────────────
router.get("/usuarios", AuthCadastroLoginController.listarTodos);
router.delete("/usuarios/:id", AuthCadastroLoginController.deletarUsuario);

// ── Rotas protegidas ──────────────────────────────────────────────────────────
router.get("/perfil", authMiddleware, AuthCadastroLoginController.obterPerfil);
router.put(
  "/perfil",
  authMiddleware,
  AuthCadastroLoginController.atualizarPerfil,
);

module.exports = router;
