const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
class userController {
    async register(req, res, next) {
        try {
            const { username, fullname, email, password } = req.body;
            bcrypt.hash(password, 10).then((hash) => {
                const user = new User({
                    username,
                    fullname,
                    email,
                    password: hash,
                });
                user.save()
                    .then(() => res.status(201).json(user))
                    .catch(next);
            });
        } catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) return res.status(404).json({ error: 'User not found' });
            bcrypt
                .compare(password, user.password)
                .then((match) => {
                    if (!match)
                        return res
                            .status(401)
                            .json({ error: 'Invalid credentials' });
                    const accessToken = sign(
                        { username: user.username, id: user.id },
                        'importantsecret',
                    );
                    res.json({ message: 'Logged in successfully', user });
                    res.json({
                        message: 'Logged in successfully',
                        accessToken,
                    });
                })
                .catch(next);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new userController();
