import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

export const uploadSingleImage = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("Multer upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error.",
      });
    }

    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }

    next();
  });
};

export default upload;
