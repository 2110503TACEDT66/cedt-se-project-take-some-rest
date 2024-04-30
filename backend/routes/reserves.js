const express = require('express')
const router = express.Router({ mergeParams: true })

// Import controller
const {
  getReserves,
  createReserve,
  deleteReserve,
  getReserve,
  updateReserve,
  getBookedReserves,
} = require('../controllers/reserves')

const { protect, authorize } = require('../middleware/auth')

// Reserve router
router.route('/').get(protect, getReserves).post(protect, createReserve)
router.route('/booked-reserves').get(getBookedReserves)
router
  .route('/:rid')
  .delete(protect, deleteReserve)
  .get(protect, authorize('admin', 'customer', 'campgroundOwner'), getReserve)
  .put(
    protect,
    authorize('admin', 'customer', 'campgroundOwner'),
    updateReserve
  )

module.exports = router

/**
 * @swagger
 * /api/reserves:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get Reserves
 *    tags: [EPIC 2 - Campground Owner]
 *    responses :
 *      200 :
 *        description : get reserve data successfully
 *      500 :
 *        description : Some server error
 * /api/reserves/{rid}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get Reserve
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: rid
 *        schema:
 *          type: string
 *        required: true
 *        description: Reserve id
 *    responses :
 *      200 :
 *        description : get reserve data successfully
 *      500 :
 *        description : Some server error
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: Update reserve
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: rid
 *        schema:
 *          type: string
 *        required: true
 *        description: Reserve id
 *      - in: query
 *        name: cgid
 *        schema:
 *          type: string
 *        required: false
 *        description: Campground id
 *      - in: query
 *        name: sid
 *        schema:
 *          type: string
 *        required: false
 *        description: Site id
 *      - in: query
 *        name: startDate
 *        schema:
 *          type: string
 *        required: false
 *        description: Start Date
 *      - in: query
 *        name: tentSize.swidth
 *        schema:
 *          type: number
 *        required: false
 *        description: Tent's Width
 *      - in: query
 *        name: tentSize.slength
 *        schema:
 *          type: number
 *        required: false
 *        description: Tent's Length
 *      - in: query
 *        name: amount
 *        schema:
 *          type: number
 *        required: false
 *        description: Amount
 *      - in: query
 *        name: preferredName
 *        schema:
 *          type: string
 *        required: false
 *        description: Preferred Name
 *    responses :
 *      200 :
 *        description : Update reserve successfully
 *      400 :
 *        description : can't update reserve
 *      500 :
 *        description : Some server error
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: Delete Reserve
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: rid
 *        schema:
 *          type: string
 *        required: true
 *        description:  Reserve ID
 *    responses :
 *      200 :
 *        description : delete reserve successfully
 *      400 :
 *        description : can't delete reserve
 *      500 :
 *        description : Some server error
 */
