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
} = require('../controllers/users')

// Import others router
const reservesRouter = require('./reserves')

// Reserve router
router.use('/:uid/reserves', reservesRouter)

// User router
router.route('/')
  .get(protect, authorize('admin'), getUsers)
router.route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe)
router.route('/update-role/:uid')
  .put(protect, authorize('admin'), updateUserRole)
router.route('/:uid')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser)

module.exports = router
