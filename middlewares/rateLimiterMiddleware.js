const rateLimit = require('express-rate-limit');

exports.apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
});
