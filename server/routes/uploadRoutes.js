const express = require("express");
const router = express.Router();

// import
const {
  uploadImages,
} = require("../controllers/uploadController");

// Middleware
const upload = require("../middleware/uploadMiddleware");

const { protectRoute } = require("../middleware/authMiddleware");

router.post("/upload", upload.single("image"), uploadImages); // ENDPOINT:  http://localhost:5001/api/v1/upload
router.post(
  "/upload-all",
  protectRoute,
  upload.single("image"),
  uploadImages
); // ENDPOINT:  http://localhost:5001/api/v1/upload-all

module.exports = router;
