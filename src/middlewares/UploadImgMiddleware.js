const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Define storage for the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/'); // Path to the storage folder
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + ext);
    },
});
async function deleteFile(filePath) {
    try {
        fs.unlinkSync(filePath);
    } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
    }
}
// Set up multer with storage, limits, and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB file size limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Only images are allowed!'));
    },
}).single('avatar'); // Field name in the form is 'avatar'
module.exports = { upload, deleteFile };
