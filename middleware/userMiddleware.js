const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (req, res, next) {
    // Use cookie-parser middleware to parse cookies
    cookieParser()(req, res, async () => {
        if (!req.cookies.token) {
            next()
            // res.redirect('/login');
            return;
        }
        
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        try {
            const user = await User.findById(decoded.userId);
            if (!user) {
                // Redirect if user not found
                res.redirect('/login');
                return;
            }
            // Attach user to request object
            req.userId = user._id;
            next();
        } catch (error) {
            console.error('Error finding user:', error);
            res.redirect('/login');
        }
    });
};
