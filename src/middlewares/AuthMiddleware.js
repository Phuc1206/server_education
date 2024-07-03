const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const assessToken = req.headers('assessToken');
    if (!assessToken) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    try {
        const validToken = verify(assessToken, 'importantsecret');
        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};
module.exports = { validateToken };
