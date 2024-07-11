const Course = require("../models/Course");
class apiController {
  async courseSearch(req, res, next) {
    try {
      const searchQuery = req.query.q;
      console.log("Received search query:", searchQuery);
      const courses = await Course.find({
        $text: { $search: searchQuery },
      });
      res.json(courses);
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new apiController();
