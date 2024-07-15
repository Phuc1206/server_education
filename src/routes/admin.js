const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/adminController.js");
// Course routes
router.get("/course/", adminController.showCourse);
router.post("/course/create", adminController.createCourse);
router.delete("/course/remove/:id", adminController.removeCourse);
router.put("/course/update/:id", adminController.updateCourse);
// Track routes
router.post("/course/track/create", adminController.addTracksToCourse);
router.put("/course/track/update/:id", adminController.updateTracks);
router.delete("/course/track/step/delete/:id", adminController.removeStep);
router.delete("/course/track/delete/:id", adminController.removeTrack);
// User routes
router.get("/user/", adminController.showUser);
router.get("/user/blocked", adminController.showUserBlocked);
router.put("/user/:id", adminController.updateUser);
router.delete("/user/block/:id", adminController.blockUser);
router.delete("/user/destroy/:id", adminController.destroyUser);
router.patch("/user/unblock/:id", adminController.unBlockUser);
module.exports = router;
