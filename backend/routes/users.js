const express = require('express')
const router = express.Router()

// Import middleware
const { protect, authorize } = require('../middleware/auth')

// Import controller
const {
  getMe,
  getUser,
  getUsers,
  updateMe,
  updateUser,
  updateUserRole,
  deleteMe,
  deleteUser,
  getBookmarks,
  addBookmark,
  removeBookmark,
  requestCampgroundOwner,
  getUserRequests,
  rejectUpdateUserRole,
} = require('../controllers/users')

// Import others router
const reservesRouter = require('./reserves')

// Reserve router
router.use('/:uid/reserves', reservesRouter)
//router.use('/me/campground-owner-request', protect, requestCampgroundOwner)

// User router
router.route('/').get(protect, authorize('admin'), getUsers)
router
  .route('/campground-owner-request')
  .get(protect, authorize('admin'), getUserRequests)
router
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe)
router
  .route('/me/campground-owner-request')
  .put(protect, authorize('customer'), requestCampgroundOwner)
router
  .route('/update-role/:uid')
  .put(protect, authorize('admin'), updateUserRole)
router.route('/my-bookmark').get(protect, getBookmarks)
router
  .route('/my-bookmark/:cgid')
  .put(protect, addBookmark)
  .delete(protect, removeBookmark)
router
  .route('/update-role/:uid/reject')
  .put(protect, authorize('admin'), rejectUpdateUserRole)
router
  .route('/:uid')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser)
module.exports = router

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *      - name
 *      - tel
 *      - email
 *      - password
 *      - role
 *      properties:
 *        name:
 *          type: string
 *          example: witty
 *        tel:
 *          type: string
 *          example: 083-021-5057
 *        email:
 *          type: string
 *          example: witty@gmail.com
 *        password:
 *          type: string
 *          example: root123
 *        role:
 *          type: string
 *          description: customer campgroundOwner admin
 *          example: customer
 */

/**
 * @swagger
 * /api/users/my-bookmark/{cgid}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: add campground to my bookmark
 *    tags: [EPIC 1 - Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        required: true
 *        description: Camgpground Id
 *    responses :
 *      200 :
 *        description : successfully add to bookmark
 *      400 :
 *        description : Bad Request
 *      500 :
 *        description : Some server error
 *  delete :
 *    security:
 *      - bearerAuth: []
 *    summary: delete campground from my bookmark
 *    tags: [EPIC 1 - Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        required: true
 *        description: Campground Id
 *    responses:
 *      200:
 *        description: Delete campground from my bookmark successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Some error happened
 * /api/users/my-bookmark:
 *  get :
 *    security:
 *      - bearerAuth: []
 *    summary: get my bookmark
 *    tags: [EPIC 1 - Exploring Campground]
 *    responses:
 *      200:
 *        description: Get Reviews successfully
 *      500:
 *        description: Some error happened
 */

/**
 * @swagger
 * /api/users/me/campground-owner-request:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: User request to be campground owner
 *    tags: [EPIC 2 - Campground Owner]
 *    responses:
 *      200:
 *        description: Request sent successfully
 *      404:
 *        description: Cannot find user
 *      500:
 *        description: Some error happened
 * /api/users/campground-owner-request:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: get all user request (admin)
 *    tags: [EPIC 2 - Campground Owner]
 *    responses :
 *      200 :
 *        description : successfully
 *      500 :
 *        description : Some server error
 * /api/users/update-role/{ID}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: Approve request to be campground owner (admin)
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              role:
 *                type: string
 *                example: campgroundOwner
 *    responses:
 *      200:
 *        description: Approve request successfully
 *      404:
 *        description: Cannot find user
 *      500:
 *        description: Some error happened
 * /api/users/update-role/{ID}/reject:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: Reject request to be campground owner (admin)
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
 *    responses:
 *      200:
 *        description: Reject request successfully
 *      404:
 *        description: Cannot find user
 *      500:
 *        description: Some error happened
 */
