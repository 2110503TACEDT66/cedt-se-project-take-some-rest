const express = require('express')
const router = express.Router()

// Import middleware
const { protect, authorize } = require('../middleware/auth')

// Import controllers
const { 
  getLogs, 
  getLog, 
  deleteLog 
} = require('../controllers/logs')

// Logs router
router.route('/')
  .get(protect, authorize('admin'), getLogs)
router.route('/:lid')
  .get(protect, authorize('admin'), getLog)
  .delete(protect, authorize('admin'), deleteLog)

module.exports = router
