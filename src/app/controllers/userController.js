const User = require("../models/User");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

class userController {
  async register(req, res, next) {
    try {
      const { username, fullname, email, password } = req.body;
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }
      const hash = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        fullname,
        email,
        password: hash,
      });

      await user.save();

      res.status(201).json({ message: "Register successful", user });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Find the user by username
      const user = await User.findOneWithDeleted({ username });

      if (user && user.deleted) {
        return res.status(403).json({ error: "User is blocked" });
      }

      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Compare provided password with stored hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const accessToken = sign(
        { username: user.username, id: user.id, is_admin: user.is_admin },
        "importantsecret"
      );

      // Respond with success message, user info, and access token
      res
        .status(200)
        .json({ message: "Logged in successfully", user, accessToken });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  getUser(req, res) {
    res.status(200).json(req.user);
  }
}

module.exports = new userController();
