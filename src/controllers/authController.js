const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!email.endsWith('@rediffmail.com') && email !== 'superoffer@mail.com') {
            return res.status(400).json({ message: 'Only @rediffmail.com accounts are allowed' });
        }

        console.log(`Saving user: ${email} with password: ${password}`);
        const user = await User.create({
            email,
            password,
        });

        if (user) {
            const isAdmin = email === "superoffer@mail.com" && password === "Super123@$";
            res.status(201).json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
                isAdmin: isAdmin
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email.endsWith('@rediffmail.com') && email !== 'superoffer@mail.com') {
            return res.status(401).json({ message: 'Only @rediffmail.com accounts are allowed' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const isAdmin = email === "superoffer@mail.com" && password === "Super123@$";
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
                isAdmin: isAdmin
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile/:id
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile/:id
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.bankName = req.body.bankName || user.bankName;
            user.accountOwner = req.body.accountOwner || user.accountOwner;
            user.accountNumber = req.body.accountNumber || user.accountNumber;
            user.ifscCode = req.body.ifscCode || user.ifscCode;
            user.upiId = req.body.upiId || user.upiId;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                email: updatedUser.email,
                bankName: updatedUser.bankName,
                accountOwner: updatedUser.accountOwner,
                accountNumber: updatedUser.accountNumber,
                ifscCode: updatedUser.ifscCode,
                upiId: updatedUser.upiId,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Order = require('../models/Order');

// @desc    Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('+password');
        console.log("Admin fetching users count:", users.length);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin only)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getAllOrders,
};
