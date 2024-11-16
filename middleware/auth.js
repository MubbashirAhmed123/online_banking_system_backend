// isRegisteredForOnlineTransaction.js
const jwt = require('jsonwebtoken');
const UserAcc = require('../model/userAccount');
require('dotenv').config();

const isRegisteredForOnlineTransaction = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const user = await UserAcc.findOne({ email: decoded.email });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            req.user = { email: user.email }; // Set only the email in req.user
            next();
        } else {
            return res.status(401).json({ message: 'Authorization header not found.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Authentication failed.' });
    }
};

module.exports = isRegisteredForOnlineTransaction;
