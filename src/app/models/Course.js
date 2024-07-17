const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const Schema = mongoose.Schema;

const Course = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    level: { type: String },
    students_count: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    slug: { type: String, slug: "title", unique: true },
    duration: { type: String, required: true },
    // is_logged: { type: Boolean, default: true },
    tracks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Track",
      },
    ],
  },
  {
    timestamps: true,
  }
);
Course.index({ title: "text" });
mongoose.plugin(slug);

module.exports = mongoose.model("Course", Course);
