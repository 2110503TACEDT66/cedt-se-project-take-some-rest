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
  .put(protect, requestCampgroundOwner)
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
