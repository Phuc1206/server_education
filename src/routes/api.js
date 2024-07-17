const express = require("express");
const router = express.Router();
const apiController = require("../app/controllers/apiController.js");
router.get("/", apiController.home);
router.get("/course/search", apiController.courseSearch);
router.get("/course/:slug", apiController.showCourse);
router.post("/course/enroll/:courseId", apiController.enrollCourse);
module.exports = router;
