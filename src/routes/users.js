const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddleware");
const router = express.Router();
const userController = require("../app/controllers/userController.js");
router.get("/", validateToken, userController.getUser);
router.post("/", userController.register);
router.post("/login", userController.login);
module.exports = router;
