const express = require('express')
const router = express.Router({ mergeParams: true })

// Import controller
const {
  getReviews,
  getMyCampgroundReviews,
  getReportedReviews,
  getReview,
  createReview,
  deleteReview,
  reportReview,
} = require('../controllers/reviews')

const { protect, authorize } = require('../middleware/auth')

// Review router
router.route('/')
  .get(getReviews)
  .post(protect, createReview)
router
  .route('/my-campgrounds')
  .get(protect, authorize('admin', 'campgroundowner'), getMyCampgroundReviews)
router
  .route('/reported-review')
  .get(protect, authorize('admin'), getReportedReviews)
router
  .route('/:rvid')
  .get(getReview)
  .put(protect, authorize('campgroundOwner'), reportReview)
  .delete(protect, deleteReview)

module.exports = router
