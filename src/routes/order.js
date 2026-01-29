const express = require('express');
const router = express.Router();
const { addOrder, getUserOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', addOrder);
router.get('/:userId', getUserOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
