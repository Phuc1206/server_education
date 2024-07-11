const Course = require("../models/Course");
const User = require("../models/User");
class adminController {
  async createCourse(req, res) {
    const { name, description, image, videoId, level } = req.body;
    const course = await Course.create({
      name,
      description,
      image,
      videoId,
      level,
    });
    return res.json(course);
  }
  async showCourse(req, res) {
    const courses = await Course.find({});
    return res.json(courses);
  }
  async showUser(req, res) {
    const user = await User.find({});
    return res.json(user);
  }
  async updateUser(req, res) {
    User.updateOne({ _id: req.params.id }, req.body);
    return res.json({ message: "User updated successfully" });
  }
}
module.exports = new adminController();
