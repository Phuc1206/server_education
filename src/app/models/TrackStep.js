const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrackStep = new Schema(
  {
    position: { type: Number, required: true },
    lesson: {
      question: { type: String, default: "" },
      answer: { type: String, default: "" },
      option_a: { type: String, default: "" },
      option_b: { type: String, default: "" },
      option_c: { type: String, default: "" },
      option_d: { type: String, default: "" },
      explanation: { type: String, default: "" },
    },
    video: {
      title: { type: String, required: true },
      url: { type: String, required: true },
      image_url: { type: String, default: "" },
      duration: { type: Number, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TrackStep", TrackStep);
