const Campground = require('../models/Campground')
const Review = require('../models/Review')
const User = require('../models/User')

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
exports.getReportedReviews = async (req, res, next) => {}
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
exports.createReview = async (req, res, next) => {}
exports.deleteReview = async (req, res, next) => {}
exports.reportReview = async (req, res, next) => {}
