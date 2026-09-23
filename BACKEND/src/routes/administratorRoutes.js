const express = require('express');
const administratorController = require('../controllers/administratorController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);
router.get('/', administratorController.list);
router.post('/', administratorController.create);
router.patch('/:id/estado', administratorController.updateStatus);

module.exports = router;
