const express = require("express");
const router = express.Router();
const homeController = require("../app/controllers/homeController.js");
router.get("/", homeController.index);
router.post("/post", homeController.createTest);
module.exports = router;
