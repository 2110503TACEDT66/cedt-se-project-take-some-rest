const express = require('express')
const router = express.Router()

// Import middleware
const { protect, authorize } = require('../middleware/auth')

// Import Campground controllers
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
  uploadCampgroundImage,
  getMyCampgrounds,
} = require('../controllers/campground')

// Import Campground controllers
const {
  createCampgroundSite,
  getCampgroundSite,
  deleteCampgroundSite,
  getCampgroundSites,
  updateCampgroundSite,
  uploadSiteImage,
} = require('../controllers/campgroundSites')

// Import others router
const reservesRouter = require('./reserves')
const reviewsRouter = require('./reviews')

// Reserve router
router.use('/:cgid/sites/:sid/reserves', reservesRouter)
router.use('/:cgid/reserves', reservesRouter)

// Review router
router.use('/:cgid/reviews', reviewsRouter)

// Campground router
router
  .route('/')
  .get(getCampgrounds)
  .post(protect, authorize('admin', 'campgroundOwner'), createCampground)
router
  .route('/my-campground')
  .get(protect, authorize('campgroundOwner','admin') ,getMyCampgrounds)
router
  .route('/:id')
  .get(getCampground)
  .put(protect, authorize('admin', 'campgroundOwner'), updateCampground)
  .delete(protect, authorize('admin', 'campgroundOwner'), deleteCampground)
router.route('/:cgid/upload-image').post(uploadCampgroundImage)
router
  .route('/:cgid/sites')
  .get(getCampgroundSites)
  .post(protect, authorize('admin', 'campgroundOwner'), createCampgroundSite)
router
  .route('/:cgid/sites/:sid')
  .get(getCampgroundSite)
  .put(protect, authorize('admin', 'campgroundOwner'), updateCampgroundSite)
  .delete(protect, authorize('admin', 'campgroundOwner'), deleteCampgroundSite)
router
  .route('/:cgid/sites/:sid/upload-image')
  .post(protect, authorize('admin', 'campgroundOwner'), uploadSiteImage)

module.exports = router
