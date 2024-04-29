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
  .get(protect, authorize('campgroundOwner','admin') ,getMyCampgrounds)
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
 *  securitySchemes:
 *    bearerAuth:            
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT 
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *      - name
 *      - tel
 *      - email
 *      - password
 *      - role
 *      properties:
 *        name:
 *          type: string
 *          example: witty
 *        tel:
 *          type: string
 *          example: 083-021-5057
 *        email:
 *          type: string
 *          example: witty@gmail.com
 *        password:
 *          type: string
 *          example: root123
 *        role:
 *          type: string
 *          description: customer campgroundOwner admin
 *          example: customer
 */



/**
 * @swagger
 * tags:
 *  name: Authorization
 */
/**
 * @swagger
 * tags:
 *  name: Exploring Campground
 *  description: Customer Exploring Campground
 */
/**
 * @swagger
 * tags:
 *  name: Campground Owner
 *  description: Managing your campground
 */



/**
 * @swagger
 * /api/auth/register:
 *  post:
 *    summary: Register User
 *    tags: [Authorization]
 *    requestBody :
 *      required : true
 *      content :
 *        application/json :
 *          schema :
 *            $ref : '#/components/schemas/User'
 *    responses :
 *      201 :
 *        description : successfully to creadted
 *        content :
 *          application/json :
 *            schema :
 *              $ref : '#/components/schemas/User'
 *      500 :
 *        description : Some server error
 * /api/auth/login:
 *  post:
 *    summary: Log-in User
 *    tags: [Authorization]
 *    requestBody :
 *      required : true
 *      content :
 *        application/json :
 *          schema :
 *            properties:
 *              email:
 *                type: string
 *                example: witty@gmail.com
 *              password:
 *                type: string
 *                example: root123
 *    responses :
 *      201 :
 *        description : Log-in successfully
 *      500 :
 *        description : Some server error
 * /api/auth/logout:
 *  get:
 *    summary: Log-out User
 *    tags: [Authorization]
 *    responses :
 *      201 :
 *        description : Log-out successfully
 *      500 :
 *        description : Some server error
 * /api/users/me:
 *  get:
 *    security:
 *      - bearerAuth: [] 
 *    summary: get me
 *    tags: [Authorization]
 *    responses :
 *      201 :
 *        description : successfully
 *      500 :
 *        description : Some server error
 */
/**
 * @swagger
 * /api/users/me/campground-owner-request:
 *  put:
 *    security:
 *      - bearerAuth: [] 
 *    summary: User request to be campground owner
 *    tags: [Campground Owner]
 *    responses:
 *      200:
 *        description: Request sent successfully
 *      404:
 *        description: Cannot find user
 *      500:
 *        description: Some error happened
 */