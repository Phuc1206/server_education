const Course = require("../models/Course");
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
}
module.exports = new apiController();
