const Course = require("../models/Course");
const User = require("../models/User");
class apiController {
  async home(req, res, next) {
    const course = await Course.find({});
    res.json(course);
  }
  async courseSearch(req, res, next) {
    try {
      const searchQuery = req.query.q;
      const regex = new RegExp(`^${searchQuery}`, "i"); // 'i' option for case-insensitive
      const courses = await Course.find({
        $or: [{ title: { $regex: regex } }],
      });
      res.json(courses);
    } catch (err) {
      next(err);
    }
  }
  async showCourse(req, res, next) {
    const slug = req.params.slug;
    try {
      const course = await Course.findOne({ slug: slug }).populate({
        path: "tracks",
        populate: { path: "track_steps" },
      });
      res.json(course);
    } catch (err) {
      next(err);
    }
  }
  async enrollCourse(req, res, next) {
    try {
      const { courseId } = req.params;
      const { userId } = req.body;
      const user = await User.findById(userId); // Find the user in the database

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!course.students_count.includes(userId)) {
        course.students_count.push(userId);
        await course.save();
      }

      if (!user.course_id.includes(courseId)) {
        user.course_id.push(courseId);
        await user.save();
      }
      res.status(200).json({ message: "Enrolled in course successfully" });
    } catch (err) {
      console.error("Error enrolling in course:", err);
      res.status(500).json({
        message: "An error occurred while enrolling in the course",
        error: err.message,
      });
    }
  }
}
module.exports = new apiController();
