const Course = require('../models/Course');
class testController {
    async index(req, res, next) {
        const course = await Course.find({})
        res.json(course);
    }
    async createTest(req, res, next) {
        const course = new Course({
            name: req.body.name,
        });
        try {
            await course.save();
            res.send(course);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}
module.exports = new testController();
