const express=require('express')
const { createUserAccount, registerInternetBanking, getUsers, userLogin, getUser } = require('../controllers/userControllers')
const isRegisteredForOnlineTransaction = require('../middleware/auth')


const router=express.Router()

router.post('/createAcc',createUserAccount)
router.post('/userLogin',userLogin)
router.post('/internetBanking',registerInternetBanking)
router.get('/',isRegisteredForOnlineTransaction,getUser)

module.exports=router