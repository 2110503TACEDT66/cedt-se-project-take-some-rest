const express = require('express')
const router = express.Router({ mergeParams: true })

// Import controller
const {
  getReviews,
  getReportedReviews,
  getReview,
  createReview,
  deleteReview,
  updateReviewReport,
} = require('../controllers/reviews')

const { protect, authorize } = require('../middleware/auth')

// Review router
router.route('/').get(getReviews).post(protect, createReview)
router
  .route('/reported-review')
  .get(protect, authorize('admin'), getReportedReviews)
router
  .route('/:rvid')
  .get(getReview)
  .put(protect, authorize('admin', 'campgroundOwner'), updateReviewReport)
  .delete(protect, authorize('admin', 'customer'), deleteReview)

module.exports = router
