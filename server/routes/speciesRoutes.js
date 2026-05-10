const express = require("express");
const router = express.Router();

// import controller
const {
  addSpecie,
  getAllSpecies,
  getAllSpeciesByQuery,
  getOneSpecie,
  updateSpecie,
  deleteSpecie,
  searchSpecies,
} = require("../controllers/speciesController");

// import middleware
const { protectRoute } = require("../middleware/authMiddleware");
const uploadSpecies = require("../middleware/uploadSpeciesMiddleware");

// Middleware for Admin Only
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// router CRUD Species
router.post(
  "/create",
  protectRoute,
  adminOnly,
  uploadSpecies.single("image"),
  addSpecie
);
router.get("/all", getAllSpecies);
router.get("/allbyquery", getAllSpeciesByQuery);

// Search Species
router.get("/search", searchSpecies);

router.get("/:_id", protectRoute, getOneSpecie);
router.put(
  "/:_id",
  protectRoute,
  adminOnly,
  uploadSpecies.single("image"),
  updateSpecie
);
router.delete("/:_id", protectRoute, adminOnly, deleteSpecie);

module.exports = router;
