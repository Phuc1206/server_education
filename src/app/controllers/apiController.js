const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const mongoose = require('mongoose');
const path = require('path');
const { upload, deleteFile } = require('../../middlewares/UploadImgMiddleware');
const exp = require('constants');
class apiController {
    async home(req, res, next) {
        try {
            const course = await Course.find({});
            res.json(course);
        } catch (err) {
            res.status(500).json({
                message: 'Error fetching courses',
                error: err.message,
            });
            next(err);
        }
    }
    async profile(req, res, next) {
        const userId = req.params.id;
        try {
            const user = await User.findById(userId)
                .populate({
                    path: 'course_id',
                    populate: {
                        path: 'tracks',
                        populate: { path: 'track_steps' },
                    },
                })
                .exec();
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({
                message: 'Error fetching profile',
                error: err.message,
            });
            next(err);
        }
    }

    async uploadAvatar(req, res, next) {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: err });
            }
            try {
                const userId = req.params.id;
                const newAvatarPath = req.file.filename;

                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const oldAvatarPath = user.avatar
                    ? path.join('public/img/', user.avatar)
                    : null;

                user.avatar = newAvatarPath;
                await user.save();

                if (oldAvatarPath) {
                    deleteFile(oldAvatarPath);
                }

                res.status(200).json({
                    message: 'Avatar uploaded successfully',
                    user,
                });
            } catch (err) {
                res.status(500).json({
                    message: 'Error uploading avatar',
                    error: err.message,
                });
                next(err);
            }
        });
    }
    async courseSearch(req, res, next) {
        try {
            const searchQuery = req.query.q;
            const regex = new RegExp(`^${searchQuery}`, 'i'); // 'i' option for case-insensitive
            const courses = await Course.find({
                $or: [{ title: { $regex: regex } }],
            });
            res.json(courses);
        } catch (err) {
            res.status(500).json({ message: err.message });
            next(err);
        }
    }
    async showCourse(req, res, next) {
        const slug = req.params.slug;
        try {
            const course = await Course.findOne({ slug: slug }).populate({
                path: 'tracks',
                populate: { path: 'track_steps' },
            });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json(course);
        } catch (err) {
            res.status(500).json({
                message: 'Failed to fetch course data',
                error: err.message,
            });
            next(err);
        }
    }
    async enrollCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            const { userId } = req.body;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            if (!course.students_count.includes(userId)) {
                course.students_count.push(userId);
                await course.save();
            }

            if (!user.course_id.includes(courseId)) {
                user.course_id.push(courseId);
                await user.save();
            }
            res.status(200).json({
                message: 'Enrolled in course successfully',
            });
        } catch (err) {
            console.error('Error enrolling in course:', err);
            res.status(500).json({
                message: 'An error occurred while enrolling in the course',
                error: err.message,
            });
            next(err);
        }
    }
    async saveProgress(req, res, next) {
        const { userId, courseId, trackId, trackStepId, progress } = req.body;
        try {
            let progressRecord = await Progress.findOne({
                user: userId,
                course: courseId,
            });

            if (progressRecord) {
                const trackIndex = progressRecord.track.findIndex((track) =>
                    track.equals(trackId),
                );
                const trackStepIndex = progressRecord.trackStep.findIndex(
                    (step) => step.equals(trackStepId),
                );
                if (trackIndex === -1) {
                    progressRecord.track.push(trackId);
                }
                if (trackStepIndex === -1) {
                    progressRecord.trackStep.push(trackStepId);
                }
                progressRecord.progress = progress;
            } else {
                progressRecord = new Progress({
                    user: userId,
                    course: courseId,
                    track: [trackId],
                    trackStep: [trackStepId],
                    progress,
                });
            }

            await progressRecord.save();
            res.status(200).json({ message: 'Progress saved successfully' });
        } catch (error) {
            console.error('Error saving progress:', error);
            res.status(500).json({ message: 'Error saving progress', error });
            next(error);
        }
    }
    async getProgress(req, res, next) {
        const { userId, courseId } = req.params;
        try {
            const progressRecord = await Progress.findOne({
                user: userId,
                course: courseId,
            })
                .populate('track')
                .populate('trackStep');
            const user = await User.findById(userId);
            if (progressRecord) {
                res.json({ progressRecord, user });
            } else {
                res.json({ message: 'Progress not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error getting progress', error });
            next(error);
        }
    }
    async getProgressUser(req, res, next) {
        const { userId } = req.params;
        try {
            const progressRecords = await Progress.find({ user: userId })
                .populate('user')
                .populate('course')
                .populate('track')
                .populate('trackStep');
            if (progressRecords.length === 0) {
                return res
                    .status(200)
                    .json({ message: 'No progress records found' });
            }
            res.json(progressRecords);
        } catch (error) {
            res.status(500).json({ message: 'Error getting progress', error });
            next(error);
        }
    }
    async getmodelClassifier(req, res) {
        const absolutePath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'public',
            'model',
            'model.json',
        );
        res.sendFile(absolutePath);
    }
}
module.exports = new apiController();
