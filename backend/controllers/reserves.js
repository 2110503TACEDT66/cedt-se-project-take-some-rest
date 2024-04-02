const Site = require('../models/Site')
const Reserve = require('../models/Reserve')
const User = require('../models/User')

// @desc    Get a reserve
// @route   GET /api/reserves/:rid
// @access  Admin & Private (me)
exports.getReserve = async (req, res, next) => {
  try {
    const reserve = await Reserve.findById(req.params.rid)
      .populate({
        path: 'campground',
        select: 'name tel address',
      })
      .populate({
        path: 'user',
        select: 'tel',
      })
      .populate({
        path: 'site',
        select: 'zone number size',
      })

    if (!reserve) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find this reserve' })
    }

    if (
      reserve.user.id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'User is not authorized to get this reserve',
      })
    }

    return res.status(200).json({ success: true, data: reserve })
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ success: false })
  }
}

// @desc    Get all reserve (with filter, sort, select and pagination)
// @route   GET /api/reserves
// @access  Admin & Private (me)
exports.getReserves = async (req, res, next) => {
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

    if (req.user.role !== 'admin') {
      queryStr.user = req.user.id
    } else {
      if (req.params.sid && req.params.cgid) {
        queryStr.campground = req.params.cgid
        queryStr.site = req.params.sid
      } else if (req.params.cgid) {
        queryStr.campground = req.params.cgid
      } else if (req.params.uid) {
        queryStr.user = req.params.uid
      }
    }

    query = Reserve.find(queryStr)
      .populate({
        path: 'campground',
        select: 'name tel address',
      })
      .populate({
        path: 'user',
        select: 'tel',
      })
      .populate({
        path: 'site',
        select: 'zone number size',
      })

    // Select field
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    // Sort field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-reservedAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Reserve.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Executing
    const reserves = await query

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

    // Send response
    return res.status(200).json({
      success: true,
      count: reserves.length,
      pagination,
      data: reserves,
    })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Create a reserve
// @route : POST /api/campgrounds/:cgid/sites/:sid/reserves
// @access : Registered user
exports.createReserve = async (req, res, next) => {
  try {
    const { startDate, tentSize, amount } = req.body
    if (!startDate || !tentSize || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the reserve's require data",
      })
    }

    let { preferredName } = req.body
    if (!preferredName) {
      preferredName = await User.findById(req.user.id).select('name')
      preferredName = preferredName.name
    }

    const data = {
      campground: req.params.cgid,
      site: req.params.sid,
      user: req.user.id,
      preferredName,
      startDate,
      tentSize,
      amount,
    }

    // Find campground site
    const campgroundSite = await Site.findOne({
      _id: data.site,
      campground: data.campground,
    })

    if (!campgroundSite) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find this site' })
    }

    // Check tent's size
    if (
      campgroundSite.size.slength < req.body.tentSize.slength ||
      campgroundSite.size.swidth < req.body.tentSize.swidth
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Your tent is too big' })
    }

    // Check user's reserve
    const userExistedReserve = await Reserve.find({
      user: data.user,
      startDate: { $gte: Date.now() },
    })

    // Check if reserve more than 3
    if (userExistedReserve.length >= 3 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User already has 3 reserve',
      })
    }

    // Check if this slot is avalible
    const existedReserve = await Reserve.findOne({
      campground: data.campground,
      site: data.site,
      startDate: data.startDate,
    })
    if (existedReserve) {
      return res.status(400).json({
        success: false,
        message: 'There are someone book this site at this time',
      })
    }

    const reserve = await Reserve.create(data)

    return res.status(201).json({ success: true, data: reserve })
  } catch (err) {
    // console.log(err)
    return res.status(500).json({ success: false })
  }
}
//@desc : Update a reserve
//@route : PUT /api/reserves/:rid
//@Access : Admin & Private (Me)
exports.updateReserve = async (req, res, next) => {
  try {
    let reserve = await Reserve.findById(req.params.rid)

    if (!reserve) {
      return res.status(404).json({
        success: false,
        message: `No reserve with the id of ${req.params.rid}`,
      })
    }

    //make sure user is the appointment owner
    if (reserve.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User is not authorized to update this reserve',
      })
    }

    reserve = await Reserve.findByIdAndUpdate(req.params.rid, req.body, {
      new: true,
      runValidators: true,
    })

    return res.status(200).json({ success: true, data: reserve })
  } catch (error) {
    // console.log(error)
    return res
      .status(500)
      .json({ success: false, message: 'Cannot Update Reserve' })
  }
}
// @desc : Delete a reserve
// @route : DEL /api/reserves/:rid
// @access : Admin & Private (Me)
exports.deleteReserve = async (req, res, next) => {
  try {
    const reserve = await Reserve.findById(req.params.rid)

    if (!reserve) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find this reserve' })
    }

    if (req.user.role !== 'admin' && reserve.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User is not authorized to delete this reserve',
      })
    }

    await reserve.deleteOne()

    return res.status(200).json({ success: true, data: {} })
  } catch (err) {
    // console.log(err)
    return res.status(500).json({ success: false })
  }
}

//@desc : Get booked reserve without user's detail (with filter, sort, select and pagination)
//@route : GET /api/reserves/booked-reserves
//@ฟccess : Public
exports.getBookedReserves = async (req, res, next) => {
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

    query = Reserve.find(queryStr)
      .select('campground site startDate')
      .populate({
        path: 'campground',
        select: 'name tel address',
      })
      .populate({
        path: 'site',
        select: 'zone number size',
      })

    // Sort field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('startDate')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Reserve.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Executing
    const reserves = await query

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

    // Send response
    return res.status(200).json({
      success: true,
      count: reserves.length,
      pagination,
      data: reserves,
    })
  } catch (err) {
    console.log(err.stack)
    return res.status(400).json({ success: false })
  }
}
