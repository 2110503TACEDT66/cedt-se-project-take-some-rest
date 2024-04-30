const express = require('express')
const router = express.Router()

// Import middleware
const { protect, authorize } = require('../middleware/auth')

// Import Campground controllers
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
  uploadCampgroundImage,
  getMyCampgrounds,
} = require('../controllers/campground')

// Import Campground controllers
const {
  createCampgroundSite,
  getCampgroundSite,
  deleteCampgroundSite,
  getCampgroundSites,
  updateCampgroundSite,
  uploadSiteImage,
} = require('../controllers/campgroundSites')

// Import others router
const reservesRouter = require('./reserves')
const reviewsRouter = require('./reviews')

// Reserve router
router.use('/:cgid/sites/:sid/reserves', reservesRouter)
router.use('/:cgid/reserves', reservesRouter)

// Review router
router.use('/:cgid/reviews', reviewsRouter)

// Campground router
router
  .route('/')
  .get(getCampgrounds)
  .post(protect, authorize('admin', 'campgroundOwner'), createCampground)
router
  .route('/my-campground')
  .get(protect, authorize('campgroundOwner', 'admin'), getMyCampgrounds)
router
  .route('/:id')
  .get(getCampground)
  .put(protect, authorize('admin', 'campgroundOwner'), updateCampground)
  .delete(protect, authorize('admin', 'campgroundOwner'), deleteCampground)
router.route('/:cgid/upload-image').post(uploadCampgroundImage)
router
  .route('/:cgid/sites')
  .get(getCampgroundSites)
  .post(protect, authorize('admin', 'campgroundOwner'), createCampgroundSite)
router
  .route('/:cgid/sites/:sid')
  .get(getCampgroundSite)
  .put(protect, authorize('admin', 'campgroundOwner'), updateCampgroundSite)
  .delete(protect, authorize('admin', 'campgroundOwner'), deleteCampgroundSite)
router
  .route('/:cgid/sites/:sid/upload-image')
  .post(protect, authorize('admin', 'campgroundOwner'), uploadSiteImage)

module.exports = router

/**
 * @swagger
 * components:
 *  schemas:
 *    Campground:
 *      type: object
 *      required:
 *      - name
 *      - tel
 *      - address
 *      properties:
 *        name:
 *          type: string
 *          example: ไทรโยค
 *        tel:
 *          type: string
 *          example: 089-028-1958
 *        address:
 *          type: object
 *          required:
 *          - houseNumber
 *          - subDistrict
 *          - district
 *          - province
 *          - postalCode
 *          properties:
 *            houseNumber:
 *              type: string
 *              example: 191
 *            subDistrict:
 *              type: string
 *              example: ไทรโยค
 *            district:
 *              type: string
 *              example: ไทรโยค
 *            province:
 *              type: string
 *              example: กาญจนบุรี
 *            postalCode:
 *              type: string
 *              example: 73420
 *            link:
 *              type: string
 *              example: https://maps.app.goo.gl/KrrVB9rtEGi3fw51A
 *        website:
 *          type: string
 *          example: https://thai.tourismthailand.org/Attraction/อุทยานแห่งชาติไทรโยค
 *        facilities:
 *          type: [String]
 *          example:  ["Tent","Electricity","Toilet"]
 *        amount:
 *          type: number
 *          example: 30
 */

/**
 * @swagger
 * /api/campgrounds:
 *  get :
 *    summary: Get campgrounds that match filter conditions
 *    tags: [EPIC 1 - Exploring Campground]
 *    parameters:
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: Campground name
 *      - in: query
 *        name: province
 *        schema:
 *          type: string
 *        description: Campground province
 *      - in: query
 *        name: facilities
 *        schema:
 *          type: array
 *          items:
 *            type: string
 *        description: Campground facilities
 *        example: ["tent", "parking"]
 *    responses:
 *      200:
 *        description: Get Filter Campground successfully
 *      500:
 *        description: Some error happened
 * /api/campgrounds/{cgid}/sites/{sid}:
 *  get :
 *    summary: Get campground site
 *    tags: [EPIC 1 - Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        description: campground id
 *      - in: path
 *        name: sid
 *        schema:
 *          type: string
 *        description: campground site id
 *    responses:
 *      200:
 *        description: Get Campground Site successfully
 *      500:
 *        description: Some error happened
 * /api/campgrounds/{cgid}/reviews:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: Create review
 *    tags: [EPIC 1 - Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        required: true
 *        description: Campground id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              comment:
 *                type: string
 *                example: good
 *              score:
 *                type: int
 *                example: 5
 *    responses :
 *      201 :
 *        description : successfully to created
 *        content :
 *          application/json :
 *            schema :
 *              $ref : '#/components/schemas/Review'
 *      400 :
 *        description : invalid input
 *      500 :
 *        description : Some server error
 *  get :
 *    summary: Get review for a specific campground
 *    tags: [EPIC 1 & 2]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        required: true
 *        description: campground id
 *    responses:
 *      200:
 *        description: Get Reviews successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Some error happened
 */

/**
 * @swagger
 * /api/campgrounds:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: Add my campground (campgroundOwner ,admin)
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref : '#/components/schemas/Campground'
 *    responses:
 *      201:
 *        description: Add my campground successfully
 *      404:
 *        description: Cannot find user
 *      500:
 *        description: Some error happened
 * /api/campgrounds/my-campground:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: View all of my campground (campgroundOwner)
 *    tags: [EPIC 2 - Campground Owner]
 *    responses :
 *      200 :
 *        description : successfully
 *      500 :
 *        description : Some server error
 * /api/campgrounds/{cgid}:
 *  get :
 *    summary: Get campground detail
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        description: campground id
 *    responses:
 *      200:
 *        description: Get Campground successfully
 *      500:
 *        description: Some error happened
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: Update my campground (campgroundOwner)
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        required: true
 *        description: Campground id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref : '#/components/schemas/Campground'
 *    responses :
 *      200 :
 *        description : successfully
 *      500 :
 *        description : Some server error
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: Delete my campground (campgroundOwner)
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        required: true
 *        description: Campground id
 *    responses :
 *      200 :
 *        description : successfully
 *      500 :
 *        description : Some server error
 * /api/campgrounds/{cgid}/sites/{sid}/upload-image:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: Upload campground site's picture (campgroundOwner, admin)
 *    tags: [EPIC 2 - Campground Owner]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        required: true
 *        description: Campground's Id
 *      - in: path
 *        name: sid
 *        schema:
 *          type: string
 *        required: true
 *        description: Campground site's Id
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *    responses :
 *      200 :
 *        description : upload campgroundSite's Image
 *      500 :
 *        description : Some server error
 */
