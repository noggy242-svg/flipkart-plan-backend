const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bankName: { type: String, default: "" },
    accountOwner: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    ifscCode: { type: String, default: "" },
    upiId: { type: String, default: "" },
}, {
    timestamps: true,
});

// Direct comparison for plain text passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return enteredPassword === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
