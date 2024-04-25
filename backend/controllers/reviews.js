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

    if (reqQuery.hasOwnProperty('comment')) {
      reqQuery.comment = { $regex: reqQuery.comment, $options: 'i' }
    }

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
        select: 'name tel address campgroundOwner',
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

// @desc    Get all reviews (with filter, sort, select and pagination)
// @route   GET /api/reviews/my-campgrounds
// @access  Campground Owner
exports.getMyCampgroundReviews = async (req, res, next) => {
  try {
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over to remove fields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    if (reqQuery.hasOwnProperty('comment')) {
      reqQuery.comment = { $regex: reqQuery.comment, $options: 'i' }
    }

    let queryStr = JSON.stringify(reqQuery)

    // Create operator $gt $gte
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    queryStr = JSON.parse(queryStr)

    if (req.user.role == 'campgroundOwner') {
      const myCampground = await Campground.find({
        campgroundOwner: req.user.id,
      }).select('_id')

      let myCampgroundArray = []
      for (let obj of Array.from(myCampground)) {
        myCampgroundArray.push(obj.id.toString())
      }

      queryStr.campground = {
        $in: myCampgroundArray,
      }
    }

    query = Review.find(queryStr)
      .populate({
        path: 'campground',
        select: 'name tel address campgroundOwner',
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
    //console.log(err)
    res.status(500).json({ success: false, error: 'Server Error' })
  }
}

// @desc    Get all reported reviews (with filter, sort, select and pagination)
// @route   GET /api/reviews/reported-review
// @access  Admin
exports.getReportedReviews = async (req, res, next) => {
  try {
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over to remove fields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    if (reqQuery.hasOwnProperty('comment')) {
      reqQuery.comment = { $regex: reqQuery.comment, $options: 'i' }
    }

    let queryStr = JSON.stringify(reqQuery)

    // Create operator $gt $gte
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    queryStr = JSON.parse(queryStr)

    queryStr.isReport = true

    if (req.params.cgid) {
      queryStr.campground = req.params.cgid
    }

    query = Review.find(queryStr)
      .populate({
        path: 'campground',
        select: 'name tel address campgroundOwner',
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
    if (score < 0) {
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

    //Update AvgRating
    const oldScore = campgroundObj.averageScore
    if (score !== oldScore) {
      const count = (await Review.find({ campground: data.campground })).length
      let newScore = (oldScore * count + score) / (count + 1)
      // let newScore = 2
      const camp = await Campground.findByIdAndUpdate(
        req.params.cgid,
        { averageScore: newScore },
        {
          new: true,
          runValidators: true,
        }
      )
      //console.log(camp)
    }

    //Create Review
    const review = await Review.create(data)

    return res.status(201).json({ success: true, data: review })
  } catch (err) {
    //console.log(err)
    return res.status(500).json({ success: false })
  }
}

// @desc    Delete a review
// @route   DEL /api/reviews/:rvid
// @access  Admin & Private me
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.rvid)

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find this review' })
    }

    if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User is not authorized to delete this review',
      })
    }

    const campgroundObj = await Campground.findOne({
      _id: review.campground,
    })

    //Update AvgRating
    const oldScore = campgroundObj.averageScore

    const count = (await Review.find({ campground: review.campground })).length
    let newScoreDel
    if (count <= 1) newScoreDel = 0
    else newScoreDel = (oldScore * count - review.score) / (count - 1)
    const camp = await Campground.findByIdAndUpdate(
      review.campground,
      { averageScore: newScoreDel },
      {
        new: true,
        runValidators: true,
      }
    )
    //console.log(camp)

    //Delete Review
    await review.deleteOne()

    return res.status(200).json({ success: true, data: {} })
  } catch (err) {
    //console.log(err)
    return res.status(500).json({ success: false })
  }
}

// @desc    Request to del review
// @route   PUT /api/reviews/:rvid
// @access  Campground Owner
exports.reportReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.rvid).populate({
      path: 'campground',
      select: 'campgroundOwner',
    })
    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No review with the id of ${req.params.rvid}`,
      })
    }

    //make sure user is the appointment owner
    if (review.campground.campgroundOwner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User is not authorized to report this review',
      })
    }

    const thisReview = await Review.findByIdAndUpdate(
      req.params.rvid,
      { isReport: true },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!thisReview) {
      return res.status(500).json({
        success: false,
        message: 'Cannot update this review',
      })
    }

    return res.status(200).json({ success: true, data: thisReview })
  } catch (err) {
    //console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc    Decline the reported review
// @route   PUT /api/reviews/:rvid/report-decline
// @access  Admin
exports.declineReportedReview = async (req, res, next) => {
  try {
    const thisReview = await Review.findByIdAndUpdate(
      req.params.rvid,
      { isReport: false },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!thisReview) {
      return res.status(500).json({
        success: false,
        message: 'Cannot update this review',
      })
    }

    return res.status(200).json({ success: true, data: thisReview })
  } catch (err) {
    console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}
