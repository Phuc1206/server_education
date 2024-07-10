const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false },
    avatar: { type: String },
    course_id: [{ type: Schema.Types.ObjectId, ref: "course" }],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", User);
