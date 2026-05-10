const express = require("express");
const {
  getImagesByFolder,
  getFolderName,
  createGalleryFolder,
  deleteFolder,
  addImagesToGallery,
  deleteImage,
} = require("../controllers/galleryController");

const { protectRoute } = require("../middleware/authMiddleware");
const uploadGallery = require("../middleware/uploadGalleryMiddleware");

// Middleware for Admin Only
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

const router = express.Router();

router.post("/create-folder", protectRoute, adminOnly, createGalleryFolder);
router.post(
  "/add-images",
  protectRoute,
  adminOnly,
  (req, res, next) => {
    uploadGallery.array("images", 100)(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  addImagesToGallery
);
router.get("/folder-speceis", protectRoute, getFolderName);
router.get("/species", protectRoute, getImagesByFolder);
router.delete("/delete-folder", protectRoute, adminOnly, deleteFolder);
router.delete("/delete-image", protectRoute, adminOnly, deleteImage);

module.exports = router;
