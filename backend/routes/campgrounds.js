const express = require("express");
const router = express.Router();

// Import middleware
const { protect, authorize } = require("../middleware/auth");

// Import Campground controllers
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
  uploadCampgroundImage,
} = require("../controllers/campground");

// Import Campground controllers
const {
  createCampgroundSite,
  getCampgroundSite,
  deleteCampgroundSite,
  getCampgroundSites,
  updateCampgroundSite,
} = require("../controllers/campgroundSites");

// Import others router
const reservesRouter = require("./reserves");

// Reserve router
router.use("/:cgid/sites/:sid/reserves", reservesRouter);
router.use("/:cgid/reserves", reservesRouter);

// Campground router
router
  .route("/")
  .get(getCampgrounds)
  .post(protect, authorize("admin"), createCampground);
router
  .route("/:id")
  .get(getCampground)
  .put(protect, authorize("admin"), updateCampground)
  .delete(protect, authorize("admin"), deleteCampground);
router.route("/:cgid/upload-image").post(uploadCampgroundImage);
router
  .route("/:cgid/sites")
  .get(getCampgroundSites)
  .post(protect, authorize("admin"), createCampgroundSite);
router
  .route("/:cgid/sites/:sid")
  .get(getCampgroundSite)
  .put(protect, authorize("admin"), updateCampgroundSite)
  .delete(protect, authorize("admin"), deleteCampgroundSite);

module.exports = router;
