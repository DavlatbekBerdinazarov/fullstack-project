const jwt = require('jsonwebtoken');

const genereteToken = userId => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET , { expiresIn: '1d' });

    return accessToken;
};

module.exports = { genereteToken }; 