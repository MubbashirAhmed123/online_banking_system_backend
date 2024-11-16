const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAcc",
        required: true
    },
    debit: [
        {
            amount: {
                type: Number,
                required: true
            },
            destinationAccount: {
                type: String, 
                required: false
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    credit: [
        {
            amount: {
                type: Number,
                required: true
            },
            destinationAccount: {
                type: String, 
                required: false
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
