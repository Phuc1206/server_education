const Course = require("../models/Course");
const User = require("../models/User");
const Track = require("../models/Track");
const TrackStep = require("../models/TrackStep");
class adminController {
  // course controller
  async createCourse(req, res) {
    const { title, description, image, level, duration } = req.body;
    const course = await Course.create({
      title,
      description,
      image,
      level,
      duration,
    });
    return res.json(course);
  }
  async showCourse(req, res) {
    const courses = await Course.find({}).populate({
      path: "tracks",
      populate: { path: "track_steps" },
    });
    return res.json(courses);
  }
  async removeCourse(req, res) {
    const courses = await Course.findByIdAndDelete({ _id: req.params.id });
    return res.json(courses);
  }
  async updateCourse(req, res) {
    const course = await Course.updateOne({ _id: req.params.id }, req.body);
    return res.json(course);
  }
  //track controller
  async addTracksToCourse(req, res) {
    try {
      const trackData = req.body;

      const newTrack = new Track({
        course_id: trackData.course_id,
        title: trackData.title,
        position: trackData.position,
        duration: trackData.duration,
      });

      const savedTrack = await newTrack.save();

      const trackStepsPromises = trackData.track_steps.map(async (stepData) => {
        console.log(stepData);
        const newTrackStep = new TrackStep({
          position: stepData.position,
          lesson: {
            question: stepData.lesson.question,
            answer: stepData.lesson.answer,
            option_a: stepData.lesson.option_a,
            option_b: stepData.lesson.option_b,
            option_c: stepData.lesson.option_c,
            option_d: stepData.lesson.option_d,
            explanation: stepData.lesson.explanation,
          },
          video: {
            url: stepData.video.url,
            title: stepData.video.title,
          },
        });

        const savedTrackStep = await newTrackStep.save();
        savedTrack.track_steps.push(savedTrackStep._id);
      });

      await Promise.all(trackStepsPromises);

      await savedTrack.save();

      const courseId = trackData.course_id;
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (!course.tracks.includes(savedTrack._id)) {
        course.tracks.push(savedTrack._id);
        await course.save();
      }

      // Step 7: Respond with success message and details
      res.status(200).json({
        message: "Tracks added to course successfully",
        track: savedTrack,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "An error occurred while adding tracks to the course",
        error: err.message,
      });
    }
  }

  // user controller
  async showUser(req, res) {
    const user = await User.find({});
    return res.json(user);
  }
  async updateUser(req, res) {
    try {
      const { is_admin } = req.body;
      if (typeof is_admin !== "boolean") {
        return res.status(400).json({ message: "is_admin must be a boolean" });
      }

      const result = await User.updateOne(
        { _id: req.params.id },
        { is_admin: is_admin }
      );

      if (result.nModified === 0) {
        return res
          .status(404)
          .json({ message: "User not found or data is the same" });
      }

      return res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the user" });
    }
  }
  async blockUser(req, res) {
    try {
      const user = await User.delete({ _id: req.params.id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error("Error blocking user:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while blocking the user" });
    }
  }
  async unBlockUser(req, res) {
    try {
      const user = await User.restore({ _id: req.params.id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error("Error unblocking user:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while unblocking the user" });
    }
  }
  async showUserBlocked(req, res) {
    try {
      const blockedUsers = await User.findWithDeleted({ deleted: true });
      return res.json(blockedUsers);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching blocked users" });
    }
  }
  async destroyUser(req, res) {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while deleting the user" });
    }
  }
}
module.exports = new adminController();
