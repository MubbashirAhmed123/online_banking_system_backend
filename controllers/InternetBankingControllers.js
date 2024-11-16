const bcrypt = require('bcryptjs');
const UserAcc = require("../model/userAccount");
const Transaction = require("../model/transactionModel");
const { isMatch } = require("../utils/GenerateAccNo");

const getUserWithSecurityCheck = async (identifier, pin) => {
    const user = await UserAcc.findOne(identifier);
    if (!user) throw { status: 404, message: "User not found." };
    if (!await isMatch(String(pin), user.securityPin)) throw { status: 400, message: "Invalid security pin." };
    if (!user.eligibaleForIntBankig) throw { status: 400, message: "Please register for Internet Banking." };
    return user;
};

const updateTransaction = async (user, amount, type, destinationAccount = null) => {
    let transaction = await Transaction.findOne({ user: user._id }) || new Transaction({ user: user._id, debit: [], credit: [] });
    transaction[type].push({ amount, destinationAccount });
    await transaction.save();

    // Add transaction reference to user's transactions array if it's new
    if (!user.transactions.includes(transaction._id)) {
        user.transactions.push(transaction._id);
        await user.save();
    }

    return transaction;
};

const getBalance = async (req, res) => {
    const { securityPin } = req.body;
    try {
        const user = await getUserWithSecurityCheck(req.user, securityPin);
        res.status(200).json({ balance: user.balance });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error." });
    }
};

const transferAmount = async (req, res) => {
    const { transferedAmount, securityPin, accountToTransfer } = req.body;
    try {
        const user = await getUserWithSecurityCheck(req.user, securityPin);

        if (transferedAmount > user.balance) {
            throw { status: 400, message: "Insufficient balance." };
        }

        const targetUser = await UserAcc.findOne({ bankAccountNumber: accountToTransfer });
        if (!targetUser) {
            throw { status: 404, message: "Recipient account not found." };
        }

        user.balance -= transferedAmount;
        await user.save();

        targetUser.balance += transferedAmount;
        await targetUser.save();

        await updateTransaction(user, transferedAmount, 'debit', accountToTransfer);
        await updateTransaction(targetUser, transferedAmount, 'credit', user.bankAccountNumber);

        res.status(200).json({ message: "Money transferred successfully." });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error." });
    }
};

const depositAmount = async (req, res) => {
    const { bankAccountNumber, amount, securityPin } = req.body;
    try {
        const user = await getUserWithSecurityCheck({ bankAccountNumber }, securityPin);
        user.balance += amount;
        await user.save();

        await updateTransaction(user, amount, 'credit');

        res.status(200).json({ message: "Deposited successfully." });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error." });
    }
};

const changeSecurityPin = async (req, res) => {
    const { securityPin, newSecurityPin } = req.body;
    try {
        const user = await getUserWithSecurityCheck(req.user, securityPin);

        const newHashedSecurityPin = await bcrypt.hash(newSecurityPin, 8);
        user.securityPin = newHashedSecurityPin;
        await user.save();

        res.status(200).json({ message: "Pin changed successfully." });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error." });
    }
};

const getTransactions = async (req, res) => {

    try {
        const user = await UserAcc.findOne({ email: req.user.email }).populate('transactions');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const transactions = user.transactions;
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user transactions.' });
    }
};


module.exports = { getBalance, transferAmount, depositAmount, changeSecurityPin, getTransactions };
