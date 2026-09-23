const express = require('express');
const categoryController = require('../controllers/categoryController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, categoryController.list);

module.exports = router;
