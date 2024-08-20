const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send('Invalid token');
            }
            req.userId = decoded;
            next();
        });
    } else {
        res.render('unauthorized');
    }
};
