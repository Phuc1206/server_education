const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrackStep = new Schema(
  {
    position: { type: Number },
    lesson: {
      question: { type: String },
      answer: { type: String },
      option_a: { type: String },
      option_b: { type: String },
      option_c: { type: String },
      option_d: { type: String },
      explanation: { type: String },
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
