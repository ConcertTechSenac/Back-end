const express = require('express');
const ProdutoController = require('../controllers/ProdutoController');

const router = express.Router();

// Listagem e criação
router.get('/',    ProdutoController.listarTodos.bind(ProdutoController));
router.post('/',   ProdutoController.criar.bind(ProdutoController));

// Operações por ID
router.get('/:id',              ProdutoController.buscarPorId.bind(ProdutoController));
router.put('/:id',              ProdutoController.atualizar.bind(ProdutoController));
router.patch('/:id/destaque',   ProdutoController.toggleDestaque.bind(ProdutoController));
router.patch('/:id/estoque',    ProdutoController.atualizarEstoque.bind(ProdutoController));
router.delete('/:id',           ProdutoController.deletar.bind(ProdutoController));

module.exports = router;
