const express = require("express");
const router = express.Router();
const apiController = require("../app/controllers/apiController.js");
router.get("/course/search", apiController.courseSearch);
module.exports = router;
