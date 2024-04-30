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
 * components:
 *  schemas:
 *    Reserve:
 *      type: object
 *      properties:
 *        campground:
 *          type: string
 *          example: 662f177a3245db1a68cbe87f
 *        site:
 *          type: string
 *          example: 662f177a3245db1a68cbe87f
 *        preferredName:
 *          type: string
 *          example: John
 *        startDate:
 *          type: Date
 *          example: 04/28/2024
 *        tentSize:
 *          type: object
 *          properties:
 *            swidth:
 *              type: number
 *              example: 1
 *            slength:
 *              type: number
 *              example: 2
 *        amount:
 *          type: number
 *          example: 1
 */

/**
 * @swagger
 * /api/reserves:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get reserves
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
 *    summary: Get reserve
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
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref : '#/components/schemas/Reserve'
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
 *    summary: Delete reserve
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
