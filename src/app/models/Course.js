const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

const Schema = mongoose.Schema;

const Course = new Schema(
  {
    title: { type: String, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    level: { type: String },
    students_count: { type: Number },
    slug: { type: String, slug: "name", unique: true },
    duration: { type: String, required: true },
    is_logged: { type: Boolean, required: true },
    tracks: [
      {
        type: Schema.Types.ObjectId,
        ref: "track",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// mongoose.plugin(slug);
module.exports = mongoose.model("Course", Course);
