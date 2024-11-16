const mongoose = require('mongoose');

const userAccountSchema = new mongoose.Schema({
    userName: String,
    phoneNumber: Number,
    email: String,
    state: String,
    address: String,
    pinCode: Number,
    accountType: String,
    bankAccountNumber: String,
    securityPin: String,
    balance: Number,
    eligibaleForIntBankig: {
        type: Boolean,
        default: false
    },
    transactions: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
});

const UserAcc = mongoose.model('UserAccount', userAccountSchema);
module.exports = UserAcc;

