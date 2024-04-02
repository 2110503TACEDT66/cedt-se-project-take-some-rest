const express = require('express')
const router = express.Router({ mergeParams: true })

// Import controller
const {
  getReserves,
  createReserve,
  deleteReserve,
  getReserve,
  updateReserve,
  getBookedReserves,
} = require('../controllers/reserves')

const { protect, authorize } = require('../middleware/auth')

// Reserve router
router.route('/').get(protect, getReserves).post(protect, createReserve)
router.route('/booked-reserves').get(getBookedReserves)
router
  .route('/:rid')
  .delete(protect, deleteReserve)
  .get(protect, authorize('admin', 'customer'), getReserve)
  .put(protect, authorize('admin', 'customer'), updateReserve)

module.exports = router
