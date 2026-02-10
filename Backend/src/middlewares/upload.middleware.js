const multer = require('multer');
const path = require('path');

// Use memory storage for all file uploads
// Files are handled as buffers and uploaded directly to Cloudinary
// No local storage is used
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images and PDFs only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;