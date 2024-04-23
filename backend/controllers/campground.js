const Campground = require('../models/Campground')

const multer = require('multer')
// const fs = require('fs')
// const path = require('path')
// const { Buffer } = require('buffer')

// @desc : Get all campgrounds (with filter, sort, select and pagination)
// @route : GET /api/campgrounds
// @access : Public

//TODO search by contain / match str in facilityArr
exports.getCampgrounds = async (req, res, next) => {
  try {
    let query

    // Copy req.query
    let reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over to remove fields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    // Edit reqQuery Into Template
    if (reqQuery.hasOwnProperty('name')) {
      reqQuery.name = { $regex: reqQuery.name, $options: 'i' }
    }

    if (reqQuery.hasOwnProperty('province')) {
      const province = reqQuery.province
      delete reqQuery['province']
      reqQuery['address.province'] = province
    }

    if (reqQuery.hasOwnProperty('facilities')) {
      reqQuery.facilities = {
        $all: reqQuery.facilities.split(','),
      }
    }

    // Create operator $gt $gte
    let queryStr = JSON.stringify(reqQuery)

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )
    reqQuery = JSON.parse(queryStr)

    // Query Document
    query = Campground.find(reqQuery)

    // Select field
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-sites')
    }

    // Sort field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('name')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Campground.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Executing
    const campgrounds = await query

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
      count: campgrounds.length,
      pagination,
      data: campgrounds,
    })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}
// @desc : Get all my campground
// @route : GET /api/campgrounds/my-campground
// @access : CampgroundOwner
exports.getMyCampgrounds = async (req, res, next) => {
  try {
    let query

    // Copy req.query
    let reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over to remove fields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    // Edit reqQuery Into Template
    if (reqQuery.hasOwnProperty('name')) {
      reqQuery.name = { $regex: reqQuery.name, $options: 'i' }
    }

    if (reqQuery.hasOwnProperty('province')) {
      const province = reqQuery.province
      delete reqQuery['province']
      reqQuery['address.province'] = province
    }

    if (reqQuery.hasOwnProperty('facilities')) {
      reqQuery.facilities = {
        $all: reqQuery.facilities.split(','),
      }
    }

    // Create operator $gt $gte
    let queryStr = JSON.stringify(reqQuery)

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    let queryjson = JSON.parse(queryStr)
    if (req.user.role != 'admin') {
      queryjson.campgroundOwner = req.user.id
    }
    query = Campground.find(queryjson)

    // Select field
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-sites')
    }

    // Sort field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('name')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Campground.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Executing
    const campgrounds = await query

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
      count: campgrounds.length,
      pagination,
      data: campgrounds,
    })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc : Get a campground
// @route : GET /api/campgrounds/:cgid
// @access : Public
exports.getCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id).populate({
      path: 'sites',
      select: 'zone number size',
    })

    if (!campground) {
      return res.status(400).json({ success: false })
    }

    return res.status(200).json({
      success: true,
      data: campground,
    })
  } catch (err) {
    return res.status(500).json({ success: false })
  }
}

// @desc : Create a new campground (without any sites and amount = 0)
// @route : POST /api/campgrounds
// @access : Admin
exports.createCampground = async (req, res, next) => {
  try {
    // Check if data is valid
    const { name, tel, address, website, pictures, facilities, amount, sites } =
      req.body
    const {
      houseNumber,
      lane,
      road,
      subDistrict,
      district,
      province,
      postalCode,
      link,
    } = address

    if (
      !name ||
      !tel ||
      !houseNumber ||
      !subDistrict ||
      !district ||
      !province ||
      !postalCode
    ) {
      // console.log(name + tel + tentForRent + houseNumber + subDistrict + district + province + postalCode);
      return res
        .status(400)
        .json({ success: false, message: 'Please enter all required data' })
    }

    req.body.amount = 0
    req.body.sites = []
    req.body.pictures = []

    
    req.body.campgroundOwner = req.user.id
    

    const campground = await Campground.create(req.body)

    return res.status(201).json({ success: true, data: campground })
  } catch (err) {
    // console.log(err)
    return res.status(500).json({ success: false })
  }
}

// @desc : Update a campground
// @route : PUT /api/campgrounds/:cgid
// @access : Admin
exports.updateCampground = async (req, res, next) => {
  try {
    // console.log(req.params.id,req.body);
    delete req.body.pictures
    delete req.body.sites
    delete req.body.amount
    delete req.body.campgroundOwner

    if (req.user.role == 'campgroundOwner') {
      const campgroundData = await Campground.findById(req.params.id)
      if (campgroundData.campgroundOwner != req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'User is not authorized to update this campground',
        })
      }
    }

    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!campground) {
      return res.status(404).json({ success: false })
    }

    return res.status(200).json({ success: true, data: campground })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false })
  }
}

// @desc : Delete a campground
// @route : DEL /api/campgrounds/:cgid
// @access : Admin
exports.deleteCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id)

    if (req.user.role == 'campgroundOwner') {
      if (campground.campgroundOwner != req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'User is not authorized to delete this campground',
        })
      }
    }

    if (!campground) {
      return res.status(404).json({ success: false })
    }

    await campground.deleteOne()

    return res.status(200).json({ success: true, data: {} })
  } catch (err) {
    return res.status(500).json({ success: false })
  }
}

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'campgroundImage')
//   },
//   filename: (req, file, cb) => {
//     cb(null, 'campground-image' + '-' + Date.now() + '.png')
//   },
// })

const upload = multer().single('file')

exports.uploadCampgroundImage = async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      // Call the multer middleware to handle file upload
      if (err instanceof multer.MulterError) {
        // Handle multer errors
        return res.status(400).json({ success: false, message: err.message })
      } else if (err) {
        // Handle other errors
        console.error(err)
        return res
          .status(500)
          .json({ success: false, message: 'Internal server error' })
      }
      if (!req.file) {
        console.log(req.file)
        return res
          .status(400)
          .json({ success: false, message: 'No file uploaded' })
      }

      const campground = await Campground.findByIdAndUpdate(
        req.params.cgid,
        { pictureString: req.file.buffer.toString('base64') },
        { new: true }
      )
      if (!campground) {
        return res
          .status(400)
          .json({ success: false, message: "Cannot update campground's data" })
      }

      res.status(201).json({ success: true, data: campground })
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false })
  }
}
