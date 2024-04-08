const cookieParser = require('cookie-parser');

module.exports = function (req, res, next) {
    // Use cookie-parser middleware to parse cookies
    cookieParser()(req, res, () => {
        // Access token from the cookie
        const token = req.cookies.token;

        const isAuth = token ? true : false;
        // Use the token as needed
        // Example: Set a property in res.locals based on the token
        res.locals.token = isAuth;

        // Call next middleware
        next();
    });
};
