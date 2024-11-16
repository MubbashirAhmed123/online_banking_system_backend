const express=require('express')
const { getBalance, depositAmount, transferAmount, changeSecurityPin, getTransactions } = require('../controllers/InternetBankingControllers');
const isRegisteredForOnlineTransaction = require('../middleware/auth');

const router=express.Router()

router.post('/getBalance', isRegisteredForOnlineTransaction, getBalance);
router.post('/depositAmount', isRegisteredForOnlineTransaction, depositAmount);
router.post('/transferAmount', isRegisteredForOnlineTransaction, transferAmount);
router.post('/changePin',isRegisteredForOnlineTransaction,changeSecurityPin);

router.get('/transactions',isRegisteredForOnlineTransaction,getTransactions)



module.exports=router