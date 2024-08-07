const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Track = new Schema(
    {
        course_id: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        title: { type: String, required: true },
        position: { type: Number },
        duration: { type: String, required: true },
        track_steps: [
            { type: Schema.Types.ObjectId, ref: 'TrackStep', default: [] },
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Track', Track);
