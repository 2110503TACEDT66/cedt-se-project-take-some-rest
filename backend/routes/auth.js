const express = require('express')
const router = express.Router()

// Import controller
const { 
  register, 
  login, 
  logout 
} = require('../controllers/auth')

// Auth router
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

module.exports = router
