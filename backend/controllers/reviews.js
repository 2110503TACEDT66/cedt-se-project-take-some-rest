const Campground = require('../models/Campground')
const Review = require('../models/Review')
const User = require('../models/User')

// @desc    Get all reviews (with filter, sort, select and pagination)
// @route   GET /api/reviews or /api/campgrounds/:cgid/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over to remove fields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)

    // Create operator $gt $gte
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    queryStr = JSON.parse(queryStr)

    if (req.params.cgid) {
      queryStr.campground = req.params.cgid
    }

    query = Review.find(queryStr)
      .populate({
        path: 'campground',
        select: 'name tel address',
      })
      .populate({
        path: 'user',
        select: 'name tel',
      })

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Review.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Executing query
    const reviews = await query

    // Pagination result
    const pagination = {}

    // Check if can goto next or prev page
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      }
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      pagination,
      data: reviews,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

// @desc    Get all reported reviews (with filter, sort, select and pagination)
// @route   GET /api/reviews/reported-review
// @access  Admin
exports.getReportedReviews = async (req, res, next) => {}

// @desc    Get all reported reviews (with filter, sort, select and pagination)
// @route   GET /api/reviews/:rvid
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.rvid)
      .populate({
        path: 'campground',
        select: 'name tel address',
      })
      .populate({
        path: 'user',
        select: 'name tel',
      })

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      })
    }

    res.status(200).json({
      success: true,
      data: review,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

// @desc    Create a review
// @route   POST  /api/campgrounds/:cgid/reviews
// @access  All role
exports.createReview = async (req, res, next) => {
  try {
    // Check if data is valid
    const { score, comment } = req.body
    if (!score) {
      return res
        .status(400)
        .json({ success: false, message: 'Please enter score' })
    }

    const data = {
      user: req.user.id,
      campground: req.params.cgid,
      score,
      comment,
    }
    // Find campground
    const campgroundObj = await Campground.findOne({
      _id: data.campground,
    })

    if (!campgroundObj) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find this campground' })
    }
    //console.log(data)
    const review = await Review.create(data)

    return res.status(201).json({ success: true, data: review })
  } catch (err) {
    //console.log(err)
    return res.status(500).json({ success: false })
  }
}

// @desc    Delete a review
// @route   DEL /api/reviews/:rvid
// @access  Admin
exports.deleteReview = async (req, res, next) => {}

// @desc    Request to del review
// @route   PUT /api/reviews/:rvid/report
// @access  Campground Owner
exports.reportReview = async (req, res, next) => {}
