const express = require('express');
const saleController = require('../controllers/saleController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);
router.get('/', saleController.list);
router.get('/resumen-categorias', saleController.dailyCategorySummary);
router.get('/:id', saleController.detail);
router.post('/', saleController.create);

module.exports = router;
