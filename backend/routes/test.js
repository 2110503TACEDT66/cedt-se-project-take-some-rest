const express = require('express')

const User = require('../models/User')
const Reserve = require('../models/Reserve')
const Campground = require('../models/Campground')

const router = express.Router()

router.post('/users', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.create(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (err) {
    res.status(400).json({ success: false })
  }
})
router.post('/reserves', async (req, res) => {
  console.log(req.body)
  try {
    const reserve = await Reserve.create(req.body)
    res.status(201).json({ success: true, data: reserve })
  } catch (err) {
    res.status(400).json({ success: false })
  }
})
router.post('/campgrounds', async (req, res) => {
  console.log(req.body)
  try {
    const campground = await Campground.create(req.body)
    res.status(201).json({ success: true, data: campground })
  } catch (err) {
    res.status(400).json({ success: false })
  }
})

module.exports = router
