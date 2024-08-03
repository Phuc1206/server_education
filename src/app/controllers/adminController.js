const Course = require("../models/Course");
const User = require("../models/User");
const Track = require("../models/Track");
const TrackStep = require("../models/TrackStep");
const Progress = require("../models/Progress");
const getYouTubeVideoDuration = require("../utils/apiYoutube");
const { saveModel } = require("../../middlewares/SaveModelMiddleware");
const path = require("path");
const fs = require("fs");
class adminController {
  // course controller
  async createCourse(req, res) {
    try {
      const { title, description, image, level, duration } = req.body;
      const course = await Course.create({
        title,
        description,
        image,
        level,
        duration,
      });
      return res.json(course);
    } catch (err) {
      res.status(500).json({
        message: "An error occurred while creating the course",
        error: err.message,
      });
    }
  }
  async showCourse(req, res) {
    try {
      const courses = await Course.find({}).populate({
        path: "tracks",
        populate: { path: "track_steps" },
      });
      return res.json(courses);
    } catch (err) {
      res.status(500).json({
        message: "An error occurred while fetching courses",
        error: err.message,
      });
    }
  }
  async removeCourse(req, res) {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      return res.json(course);
    } catch (err) {
      res.status(500).json({
        message: "An error occurred while deleting the course",
        error: err.message,
      });
    }
  }
  async updateCourse(req, res) {
    try {
      const course = await Course.updateOne({ _id: req.params.id }, req.body);
      console.log(req.params.id);
      // if (!course.nModified) {
      //   return res
      //     .status(404)
      //     .json({ message: "Course not found or no changes made" });
      // }
      return res.json(course);
    } catch (err) {
      res.status(500).json({
        message: "An error occurred while updating the course",
        error: err.message,
      });
    }
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
        let videoDuration = stepData.video.duration;

        if (stepData.video.url && !videoDuration) {
          try {
            videoDuration = await getYouTubeVideoDuration(stepData.video.url);
          } catch (err) {
            console.error("Error fetching video duration:", err);
          }
        }
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
            duration: videoDuration,
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

  async updateTracks(req, res) {
    try {
      const trackId = req.params.id;
      const { title, duration, position, track_steps } = req.body;

      const updatedTrack = await Track.findByIdAndUpdate(
        trackId,
        {
          title,
          duration,
          position,
        },
        { new: true }
      );

      if (!updatedTrack) {
        return res.status(404).json({ message: "Track not found" });
      }

      // Cập nhật từng track_step trong track_steps
      const updatedTrackSteps = await Promise.all(
        track_steps.map(async (step) => {
          const updatedStep = await TrackStep.findByIdAndUpdate(
            step._id,
            {
              lesson: {
                question: step.lesson.question,
                answer: step.lesson.answer,
                option_a: step.lesson.option_a,
                option_b: step.lesson.option_b,
                option_c: step.lesson.option_c,
                option_d: step.lesson.option_d,
                explanation: step.lesson.explanation,
              },
              video: {
                title: step.video.title,
                url: step.video.url,
                image_url: step.video.image_url,
                duration: step.video.duration,
              },
            },
            { new: true }
          );

          return updatedStep;
        })
      );

      res.status(200).json({ updatedTrack, updatedTrackSteps });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "An error occurred while updating the track",
        error: err.message,
      });
    }
  }
  async removeStep(req, res) {
    const stepId = req.params.id;
    console.log(stepId);
    try {
      await TrackStep.findByIdAndDelete(stepId);

      res.status(200).json({ message: "Step deleted successfully" });
    } catch (error) {
      console.error("Error deleting step:", error);
      res.status(500).json({
        message: "An error occurred while deleting step",
        error: error.message,
      });
    }
  }
  async removeTrack(req, res) {
    const trackId = req.params.id;
    try {
      const deletedTrack = await Track.findByIdAndDelete(trackId);
      if (!deletedTrack) {
        return res.status(404).json({ message: "Track not found" });
      }
      await TrackStep.deleteMany({ _id: { $in: deletedTrack.track_steps } });
      res.status(200).json({ message: "Track deleted successfully" });
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({
        message: "An error occurred while deleting track",
        error: error.message,
      });
    }
  }

  // user controller
  async showUser(req, res) {
    try {
      const users = await User.find({}).populate("course_id");
      return res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "An error occurred while fetching users",
        error: err.message,
      });
    }
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
  async removeUserFromCourse(req, res) {
    const { userId, courseId } = req.params;

    try {
      // Step 1: Remove course from user's course list
      const userUpdateResult = await User.updateOne(
        { _id: userId },
        { $pull: { course_id: courseId } }
      );

      if (userUpdateResult.modifiedCount === 1) {
        // Step 2: Remove user from course's student list
        const courseUpdateResult = await Course.updateOne(
          { _id: courseId },
          { $pull: { students_count: userId } }
        );

        if (courseUpdateResult.modifiedCount === 1) {
          // Step 3: Remove progress records for this user and course
          const progressRemovalResult = await Progress.deleteMany({
            user: userId,
            course: courseId,
          });

          if (progressRemovalResult.deletedCount >= 0) {
            res.status(200).send({
              message:
                "Course removed from user and user removed from course successfully.",
            });
          } else {
            // Rollback user and course updates if progress removal fails
            await User.updateOne(
              { _id: userId },
              { $push: { course_id: courseId } }
            );
            await Course.updateOne(
              { _id: courseId },
              { $push: { students_count: userId } }
            );
            res.status(500).send({
              message: "Progress removal failed. Updates rolled back.",
            });
          }
        } else {
          // Rollback user update if course update fails
          await User.updateOne(
            { _id: userId },
            { $push: { course_id: courseId } }
          );
          res.status(404).send({
            message:
              "User removal from course failed. User update rolled back.",
          });
        }
      } else {
        res.status(404).send({ message: "User or Course not found." });
      }
    } catch (error) {
      console.error("Error removing course from user:", error);
      res.status(500).send({ message: "Internal server error." });
    }
  }

  async blockUser(req, res) {
    try {
      const user = await User.delete({ _id: req.params.id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ message: "Block user successfully", user });
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
      return res.json({ message: "Unblock user successfully", user });
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
  async saveModel(req, res, next) {
    saveModel.single("model")(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ message: err.message });
      }
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const newFilePath = path.join("public/model", req.file.filename);
        const oldFilePath = path.join("public/model", req.file.originalname);
        if (fs.existsSync(oldFilePath) && oldFilePath !== newFilePath) {
          fs.unlinkSync(oldFilePath); // Delete old file
        }
        res.status(200).json({
          message: "File uploaded successfully",
          filePath: newFilePath,
        });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Error uploading file", error: err.message });
        next(err);
      }
    });
  }
}

module.exports = new adminController();
