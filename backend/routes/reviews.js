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
  declineReportedReview,
} = require('../controllers/reviews')

const { protect, authorize } = require('../middleware/auth')

// Review router
router.route('/').get(getReviews).post(protect, createReview)
router
  .route('/my-campgrounds')
  .get(protect, authorize('admin', 'campgroundOwner'), getMyCampgroundReviews)
router
  .route('/reported-review')
  .get(protect, authorize('admin'), getReportedReviews)
router
  .route('/:rvid')
  .get(getReview)
  .put(protect, authorize('campgroundOwner'), reportReview)
  .delete(protect, deleteReview)
router
  .route('/:rvid/report-decline')
  .put(protect, authorize('admin'), declineReportedReview)

module.exports = router

/**
 * @swagger
 * components:
 *  schemas:
 *    Review:
 *      type: object
 *      required:
 *      - userId
 *      - campgroundId
 *      - comment
 *      - score
 *      properties:
 *        user:
 *          type: string
 *          example: 662f18753245db1a68cbe933
 *        campground:
 *          type: string
 *          example: 662f177a3245db1a68cbe87f
 *        comment:
 *          type: string
 *          example: good
 *        score:
 *          type: int
 *          example: 5
 */

/**
 * @swagger
 * /api/reviews/{rvid}:
 *  delete :
 *    security:
 *      - bearerAuth: []
 *    summary: Delete review (admin, review's creator)
 *    tags: [EPIC 1 & 2]
 *    parameters:
 *      - in: path
 *        name: rvid
 *        schema:
 *          type: string
 *        required: true
 *        description: Review Id
 *    responses:
 *      200:
 *        description: Delete Review Successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Some error happened
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: Report review (campgroundOwner)
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: rvid
 *        schema:
 *          type: string
 *        required: true
 *        description: Reserve Id
 *    responses :
 *      200 :
 *        description : report reserve successfully
 *      400 :
 *        description : can't report reserve
 *      500 :
 *        description : Some server error
 * /api/reviews/reported-review:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get reported reviews (admin)
 *    tags: [EPIC 2 - Campground Owner]
 *    responses :
 *      200 :
 *        description : get reported reserve data successfully
 *      500 :
 *        description : Some server error
 */
