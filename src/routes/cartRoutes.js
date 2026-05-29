const express = require("express");
const CartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", CartController.obterCarrinho);
router.post("/", CartController.adicionarItem);
router.put("/:produtoId", CartController.atualizarItem);
router.delete("/:produtoId", CartController.removerItem);
router.delete("/", CartController.limparCarrinho);
router.post("/checkout", CartController.checkout);

module.exports = router;
