const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination directory
    cb(null, "public/model/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const saveModel = multer({ storage });
module.exports = { saveModel };
