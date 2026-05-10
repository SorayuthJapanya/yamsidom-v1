const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.query.folderName;

    if (!folderName) {
      return cb(new Error("กรุณาเลือกโฟลเดอร์ที่ท่านจะเพิ่มรูปภาพ"));
    }

    const uploadDir = path.join(__dirname, "../uploads/gallery", folderName);

    if (!fs.existsSync(uploadDir)) {
      return cb(new Error("ไม่พบโฟลเดอร์ที่ทำรายการ"));
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); 
  },
});

// Filter file types (only .png, .jpg, .jpeg allowed)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".webp", ".heic"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg and .webp files are allowed!"));
  }
};

// Configure multer
const uploadGallery = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 10MB/file
  fileFilter,
});

module.exports = uploadGallery;
