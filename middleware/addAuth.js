const cookieParser = require('cookie-parser');

module.exports = function (req, res, next) {
    // Use cookie-parser middleware to parse cookies
    cookieParser()(req, res, () => {
        if (!req.cookies.token) {
            res.redirect('/login');
            return;
        }
        next();
    });
};
