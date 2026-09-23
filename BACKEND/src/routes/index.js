const express = require('express');

const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const saleRoutes = require('./saleRoutes');
const administratorRoutes = require('./administratorRoutes');

const router = express.Router();

router.use(authRoutes);
router.use('/categorias', categoryRoutes);
router.use('/productos', productRoutes);
router.use('/ventas', saleRoutes);
router.use('/administradores', administratorRoutes);

module.exports = router;
