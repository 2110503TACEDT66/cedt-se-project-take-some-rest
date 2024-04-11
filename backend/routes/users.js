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
  requestCampgroundOwner,
  getBookmarks,
  addBookmark,
  removeBookmark,
} = require('../controllers/users')

// Import others router
const reservesRouter = require('./reserves')

// Reserve router
router.use('/:uid/reserves', reservesRouter)
router.use('/me/campground-owner-request', requestCampgroundOwner)

// User router
router.route('/').get(protect, authorize('admin'), getUsers)
router
  .route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe)
router
  .route('/update-role/:uid')
  .put(protect, authorize('admin'), updateUserRole)
router.route('/my-bookmark').get(protect, getBookmarks)
router
  .route('/my-bookmark/:cgid')
  .put(protect, addBookmark)
  .delete(protect, removeBookmark)
router
  .route('/:uid')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser)
module.exports = router
