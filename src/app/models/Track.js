const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Track = new Schema(
  {
    course_id: { type: Number, required: true },
    title: { type: String, required: true },
    position: { type: Number, required: true, unique: true },
    duration: { type: Number, required: true },
    track_steps: [
      {
        position: { type: Number, required: true },
        lesson: [
          {
            question: { type: String, required: true },
            answer: { type: String, required: true },
            option_a: { type: String, required: true },
            option_b: { type: String, required: true },
            option_c: { type: String, required: true },
            option_d: { type: String, required: true },
            explanation: { type: String, required: true },
          },
        ],
        video: {
          id: { type: Number, required: true, unique: true },
          position: { type: Number, required: true },
          url: { type: String, required: true },
          image_url: { type: String, required: true },
          title: { type: String, required: true },
          duration: { type: Number, required: true },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Track", Track);
