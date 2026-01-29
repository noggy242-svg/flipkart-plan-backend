const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers, getAllOrders } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.get('/users', getAllUsers);
router.get('/orders-all', getAllOrders);

module.exports = router;
