const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Progress = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    track: [{ type: Schema.Types.ObjectId, ref: "Track", required: true }],
    trackStep: [
      {
        type: Schema.Types.ObjectId,
        ref: "TrackStep",
        required: true,
      },
    ],
    progress: { type: Number, default: 0 }, // Store progress in seconds or percentage
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Progress", Progress);
