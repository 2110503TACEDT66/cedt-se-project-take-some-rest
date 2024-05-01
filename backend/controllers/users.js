var mongoose = require('mongoose')
const User = require('../models/User')
const Campground = require('../models/Campground')

// @desc : Get your user's data
// @route : GET /api/users/me
// @access : Private (Me)
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Get a user
// @route : GET /api/users/:uid
// @access : Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.uid)

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Not found user with this id' })
    }

    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Get all user (with filter, sort, select and pagination)
// @route : GET /api/users
// @access : Admin
exports.getUsers = async (req, res, next) => {
  try {
    let query

    //Copy req.query
    const reqQuery = { ...req.query }

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    //Loop over to remove fields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)

    //Create operator $gt $gte
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )
    query = User.find(JSON.parse(queryStr))

    //Select field
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    //Sort field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await User.countDocuments()

    query = query.skip(startIndex).limit(limit)

    //Executing
    const users = await query

    //Pagination result
    const pagination = {}

    //Check if can goto next or prev page
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

    return res
      .status(200)
      .json({ success: true, count: users.length, pagination, data: users })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Update user's data (can't change user's role)
// @route : PUT /api/users/me
// @access : Private (Me)
exports.updateMe = async (req, res, next) => {
  const { name, tel, email, password } = req.body

  const newData = { name, tel, email, password }

  if (!newData) {
    return res.status(400).json({
      success: false,
      message:
        'Please provide name, telephone number, email or password to update',
    })
  }

  try {
    const user = await User.findByIdAndUpdate(req.user.id, newData, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user' })
    }

    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Update a user (can't change user's role)
// @route : PUT /api/users/:uid
// @access : Admin
exports.updateUser = async (req, res, next) => {
  const { name, tel, email, password } = req.body

  const newData = { name, tel, email, password }

  if (!newData) {
    return res.status(400).json({
      success: false,
      message:
        'Please provide name, telephone number, email or password to update',
    })
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.uid, newData, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user' })
    }

    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Update a user role
// @route : PUT /api/users/update-role/:uid
// @access : Admin
exports.updateUserRole = async (req, res, next) => {
  const { role } = req.body
  const newData = { role, requestToBeCampgroundOwner: false }
  const validRoles = ['customer', 'campgroundOwner', 'admin']

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid role to update',
    })
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.uid, newData, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user' })
    }

    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    // console.log(err.stack)
    return res.status(400).json({ success: false })
  }
}

// @desc : Reject update a user role to campground owner
// @route : PUT /api/users/update-role/:uid/reject
// @access : Admin
exports.rejectUpdateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.uid,
      { requestToBeCampgroundOwner: false },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user' })
    }

    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Delete user's account
// @route : DEL /api/users/me
// @access : Private (Me)
exports.deleteMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user' })
    }

    await user.deleteOne()

    return res.status(200).json({ success: true, data: {} })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Delete a user
// @route : DEL /api/users/:uid
// @access : Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.uid)

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user' })
    }

    await user.deleteOne()

    return res.status(200).json({ success: true, data: {} })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : User request to be campground owner
// @route : PUT /api/users/me/campground-owner-request
// @access : Private (Me)
exports.requestCampgroundOwner = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user' })
    }

    if (user.role !== 'customer') {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Only customers can request to be campground owners',
        })
    }

    if (user.requestToBeCampgroundOwner) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'User already requested to be a campground owner',
        })
    }

    const validUser = await User.findByIdAndUpdate(
      req.user.id,
      { requestToBeCampgroundOwner: true },
      {
        new: true,
        runValidators: true,
      }
    )

    return res.status(200).json({ success: true, data: validUser })
  } catch (err) {
    console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Get all user request
// @route : GET /api/users/campground-owner-request
// @access : Admin
exports.getUserRequests = async (req, res, next) => {
  try {
    let query

    //Copy req.query
    const reqQuery = { ...req.query }

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    //Loop over to remove fields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)

    //Create operator $gt $gte
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )
    let queryjson = JSON.parse(queryStr)
    queryjson.requestToBeCampgroundOwner = true
    query = User.find(queryjson)

    //Select field
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    //Sort field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await User.countDocuments()

    query = query.skip(startIndex).limit(limit)

    //Executing
    const users = await query

    //Pagination result
    const pagination = {}

    //Check if can goto next or prev page
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

    return res
      .status(200)
      .json({ success: true, count: users.length, pagination, data: users })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Add campground to your bookmark
// @route : PUT /api/users/my-bookmark/:cgid
// @access : Private (Me)
exports.addBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user' })
    }
    const campground = await Campground.findById(req.params.cgid)
    if (!campground) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find campground' })
    }
    if (user.bookmarkCampgrounds.includes(req.params.cgid)) {
      return res
        .status(400)
        .json({ success: false, message: 'Campground already bookmarked' })
    }
    const result = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { bookmarkCampgrounds: req.params.cgid } },
      { new: true }
    )
    return res
      .status(200)
      .json({ success: true, data: result.bookmarkCampgrounds })
  } catch (err) {
    //console.log(err)
    return res
      .status(500)
      .json({ success: false, message: 'Cannot add bookmark' })
  }
}

// @desc : Delete campground from your bookmark
// @route : DEL /api/users/my-bookmark/:cgid
// @access : Private (Me)
exports.removeBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user' })
    }
    const campground = await Campground.findById(req.params.cgid)
    if (!campground) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find campground' })
    }
    if (!user.bookmarkCampgrounds.includes(req.params.cgid)) {
      return res
        .status(400)
        .json({ success: false, message: 'Campground not bookmarked' })
    }
    const result = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { bookmarkCampgrounds: req.params.cgid } },
      { new: true }
    )
    return res
      .status(200)
      .json({ success: true, data: result.bookmarkCampgrounds })
  } catch (err) {
    //console.log(err)
    return res
      .status(500)
      .json({ success: false, message: 'Cannot remove bookmark' })
  }
}

// @desc : Get your bookmarked campgrounds
// @route : GET /api/users/my-bookmark
// @access : Private (Me)
exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find user with that id' })
    }

    let bookmarkedCampground = await Campground.find({
      _id: { $in: user.bookmarkCampgrounds },
    }).select('-sites')

    return res.status(200).json({
      success: true,
      count: user.bookmarkCampgrounds.length,
      data: bookmarkedCampground,
    })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}
