const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/adminController.js");
router.get("/course/", adminController.showCourse);
router.post("/course/create", adminController.createCourse);
router.get("/user/", adminController.showUser);
router.put("/user/:id", adminController.updateUser);
module.exports = router;
