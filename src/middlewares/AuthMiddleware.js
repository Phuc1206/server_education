const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const assessToken = req.header('accessToken');
    if (!assessToken) {
        return res.json({ error: 'Token not provided' });
    }
    try {
        const validToken = verify(assessToken, 'importantsecret');
        req.user = validToken;
        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.json({ error: err });
    }
};
module.exports = { validateToken };
