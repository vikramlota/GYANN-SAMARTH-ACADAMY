const multer = require('multer');
const path = require('path');
const fs = require('fs');

// For serverless environments, use memory storage
// For local development, use disk storage
const storage = process.env.NODE_ENV === 'production' || !process.env.NODE_ENV || process.env.VERCEL
  ? multer.memoryStorage()
  : (() => {
      // Try to create uploads directory for development
      try {
        if (!fs.existsSync('public/uploads/')) {
          fs.mkdirSync('public/uploads/', { recursive: true });
        }
      } catch (err) {
        console.warn('Could not create uploads directory:', err.message);
      }

      return multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'public/uploads/');
        },
        filename(req, file, cb) {
          cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        },
      });
    })();

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