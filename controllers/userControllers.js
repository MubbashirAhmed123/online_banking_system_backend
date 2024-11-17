const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const { generateAccountNumber, generateSecurityPin, isMatch } = require('../utils/GenerateAccNo');
const UserAcc = require('../model/userAccount');

const handleErrorResponse = (res, error, message) => {
    res.status(500).json({ 'message': message, 'error': error.message });
};

const findUser = async (identifier) => {
    const user = await UserAcc.findOne(identifier);
    if (!user) throw { status: 404, message: "User not found." };
    return user;
};


const createUserAccount = async (req, res) => {
    try {
        const { userName, phoneNumber, email, state, address, pinCode, accountType, initialDeposit } = req.body;

        if (!userName || !phoneNumber || !email || !state || !address || !pinCode || !accountType || initialDeposit == null) {
            return res.status(400).json({ 'msg': 'All fields are required.' });
        }

        if (await UserAcc.findOne({ email })) {
            return res.status(409).json({ 'message': 'Account already exists.' });
        }

        const securityPinToSend = generateSecurityPin();
        const newUserAcc = new UserAcc({
            userName,
            phoneNumber,
            email,
            state,
            address,
            pinCode,
            accountType,
            bankAccountNumber: generateAccountNumber(),
            securityPin: await bcrypt.hash(String(securityPinToSend), 8),
            balance: initialDeposit,
        });

        await newUserAcc.save();

        try {
            res.status(201).json({ 'message': 'Account created successfully.', 'data':{userName,email,accountNumber:newUserAcc.bankAccountNumber,securityPinToSend}
            });
        } catch (emailError) {
            res.status(500).json({
                'message': 'Something went wrong.',
                'error': emailError.message,
                
            });
        }

    } catch (error) {
        handleErrorResponse(res, error, 'Some error occurred.');
    }
};

const registerInternetBanking = async (req, res) => {
    try {
        const { bankAccountNumber, securityPin } = req.body;

        if (!bankAccountNumber || !securityPin) {
            return res.status(400).json({ 'message': 'All fields are required.' });
        }

        const existingUser = await findUser({ bankAccountNumber });
        
        const isPinMatch = await isMatch(securityPin, existingUser.securityPin)
        if (!isPinMatch) {
            return res.status(400).json({ 'message': 'Invalid security pin.' });
        }

        if (existingUser.eligibaleForIntBankig) {
            return res.status(400).json({ 'message': 'User is already registered for Internet Banking.' });
        }


       
        existingUser.eligibaleForIntBankig = true;
        await existingUser.save();

        res.status(201).json({ 'message': 'Internet Banking registration successful.' });
    } catch (error) {
        handleErrorResponse(res, error, 'Internal server error.');
    }
};

const userLogin=async (req,res)=>{

    try {
        const {email,securityPin}=req.body

        const user = await findUser({ email });

        const isPinMatch = await isMatch(securityPin, user.securityPin)
        if (!isPinMatch) {
            return res.status(400).json({ 'message': 'Invalid security pin.' });
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ 'message': 'Login successfull !',token });



    } catch (error) {
        handleErrorResponse(res, error, 'Login failed.');

        
    }
}

// Get User Transactions
const getUser = async (req, res) => {
    try {
        const user = await UserAcc.findOne({email:req.user.email}).select('-securityPin')
        res.json(user);
    } catch (error) {
        handleErrorResponse(res, error, 'Failed to fetch user transactions.');
    }
};

module.exports = { createUserAccount, registerInternetBanking, getUser,userLogin };
