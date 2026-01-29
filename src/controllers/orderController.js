const Order = require('../models/Order');

// @desc    Add new order
// @route   POST /api/orders
// @access  Private (usually requires auth middleware, but we'll use userId from body for simplicity as requested)
const addOrder = async (req, res) => {
    const { userId, title, price, url, image } = req.body;

    try {
        const order = await Order.create({
            userId,
            title,
            price,
            url,
            image,
            status: 'Pending',
            platform: 'Flipkart'
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/:userId
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        console.log(`Fetching orders for user: ${req.params.userId}`);
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrder,
    getUserOrders,
    updateOrderStatus,
};
