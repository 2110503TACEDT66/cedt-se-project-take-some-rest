const Campground = require('../models/Campground')
const Site = require('../models/Site')

// @desc    Get a campground site in specific campground
// @route   GET /api/campgrounds/:cgid/sites/:sid
// @access  Public
exports.getCampgroundSite = async (req, res, next) => {
  try {
    // Find a site
    const site = await Site.findById(req.params.sid)
    if (!site) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find this site' })
    }

    // Find a campground
    const campground = await Campground.findOne({
      id: req.params.cgid,
      sites: req.params.sid,
    }).select('-sites')

    if (!campground) {
      return res.status(404).json({
        success: false,
        message:
          "Cannot find the site in this campground, maybe your campground's id or site's id is wrong",
      })
    }

    // Send response
    return res.status(200).json({ success: true, campground, site })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}

// @desc    Get all campground sites
// @route   GET /api/campgrounds/:cgid/sites/
// @access  Public
exports.getCampgroundSites = async (req, res, next) => {
  try {
    // Find a campground
    const campground = await Campground.findById(req.params.cgid).select(
      'name tel address'
    )
    if (!campground) {
      return res.status(400).json({
        success: false,
        message: 'Cannot find the campground',
      })
    }

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

    queryJson = JSON.parse(queryStr)
    queryJson.campground = req.params.cgid

    query = Site.find(queryJson)

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
      query = query.sort('zone')
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Site.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Find sites
    const sites = await query

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

    // Send response
    res.status(200).json({
      success: true,
      campground,
      sites,
      count: sites.length,
      pagination,
    })
  } catch (err) {
    // console.log(err.stack)
    res.status(500).json({ success: false })
  }
}
// @desc    Create a new site for campground
// @route   POST /api/campgrounds/:cgid/sites
// @access  Admin
exports.createCampgroundSite = async (req, res, next) => {
  try {
    // Check if new site's data is valid
    const { zone, number, size } = req.body

    if (!zone || !number || !size) {
      return res
        .status(400)
        .json({ success: false, message: "The new site's data is not valid" })
    }

    // Check if there is no duplicated site
    const existedSite = await Site.findOne({
      campground: req.params.cgid,
      zone: zone,
      number: number,
    })

    if (existedSite) {
      return res
        .status(400)
        .json({ success: false, message: "The new site's data is duplicated" })
    }

    const site = await Site.create({
      zone,
      number,
      size,
      campground: req.params.cgid,
    })

    // Check if there is a valid campground
    const campground = await Campground.findByIdAndUpdate(
      req.params.cgid,
      {
        $push: { sites: site._id },
        $inc: { amount: 1 },
      },
      { new: true, runValidators: true }
    ).select('-sites')

    if (!campground) {
      await Site.findByIdAndDelete(site.id)
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find this campground' })
    }

    // Send response
    return res.status(201).json({ success: true, campground, newSite: site })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}
//@desc : Update a campground site in specific campground (cannot change campground id)
//@route : PUT /api/campgrounds/:cgid/sites/:sid
//@access : Admin
exports.updateCampgroundSite = async (req, res, next) => {
  try {
    const { zone, number, size } = req.body
    let campgroundSite = await Site.findByIdAndUpdate(
      req.params.sid,
      { zone, number, size },
      {
        new: true,
        runValidators: true,
      }
    )
    if (!campgroundSite) {
      return res.status(404).json({
        success: false,
        message: `No campgroundSite with the id of ${req.params.sid}`,
      })
    }
    res.status(200).json({
      success: true,
      data: campgroundSite,
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, message: 'Cannot Update CampgroundSite' })
  }
}

// @desc    Delete a campground site in specific campground
// @route   DEL /api/campgrounds/:cgid/sites/:sid
// @access  Admin
exports.deleteCampgroundSite = async (req, res, next) => {
  try {
    // Check if there is a valid campground & sites
    const site = await Site.findById(req.params.sid)

    if (!site) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find this campground site' })
    }

    await site.deleteOne()

    // Send response
    return res.status(200).json({ success: true, data: {} })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false })
  }
}
