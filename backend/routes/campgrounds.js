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
 *    Review:
 *      type: object
 *      required:
 *      - comment
 *      - score
 *      properties:
 *        comment:
 *          type: string
 *          example: good
 *        score:
 *          type: int
 *          example: 5
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
 *        description : successfully to created
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
 *      200 :
 *        description : Log-in successfully
 *      500 :
 *        description : Some server error
 * /api/auth/logout:
 *  get:
 *    summary: Log-out User
 *    tags: [Authorization]
 *    responses :
 *      200 :
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
 *      200 :
 *        description : successfully
 *      500 :
 *        description : Some server error
 */

/**
 * @swagger
 * /api/campgrounds/${cgid}/reviews:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: createReview
 *    tags: [Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        require: true
 *        description: Camgpground Id
 *    requestBody :
 *      required : true
 *      content :
 *        application/json :
 *          schema :
 *            $ref : '#/components/schemas/Review'
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
 * /api/reviews/{rvid}:
 *  delete : 
 *    security:
 *      - bearerAuth: []
 *    summary: delete Review
 *    tags: [Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: rvid
 *        schema:
 *          type: string
 *        require: true
 *        description: Review Id
 *    responses:
 *      200:
 *        description: Delete Review Successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Some error happened
 * /api/campgrounds/{cgid}/reviews:
 *  get : 
 *    security:
 *      - bearerAuth: []
 *    summary: get Reviews
 *    tags: [Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        require: true
 *        description: campground id
 *    responses:
 *      200:
 *        description: Get Reviews successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Some error happened
 * /api/users/my-bookmark/{cgid}:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: add campground to my bookmark
 *    tags: [Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        require: true
 *        description: Camgpground Id
 *    responses :
 *      200 :
 *        description : successfully add to bookmark
 *      400 :
 *        description : Bad Request
 *      500 :
 *        description : Some server error
 * api/users/my-bookmark/{cgid}:
 *  delete : 
 *    security:
 *      - bearerAuth: []
 *    summary: delete campground from my bookmark
 *    tags: [Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        require: true
 *        description: Campground Id
 *    responses:
 *      200:
 *        description: Delete campground from my bookmark successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Some error happened
 * /api/users/my-bookmark:
 *  get : 
 *    security:
 *      - bearerAuth: []
 *    summary: get my bookmark
 *    tags: [Exploring Campground]
 *    responses:
 *      200:
 *        description: Get Reviews successfully
 *      500:
 *        description: Some error happened
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
 * /api/users/campground-owner-request:
 *  get:
 *    security:
 *      - bearerAuth: [] 
 *    summary: get all user request (admin)
 *    tags: [Campground Owner]
 *    responses :
 *      200 :
 *        description : successfully
 *      500 :
 *        description : Some server error
 * /api/users/update-role/{ID}:
 *  put:
 *    security:
 *      - bearerAuth: [] 
 *    summary: Approve request to be campground owner (admin)
 *    tags: [Campground Owner]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *        require: true
 *        description: User id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              role:
 *                type: string
 *                example: campgroundOwner
 *    responses:
 *      200:
 *        description: Request sent successfully
 *      404:
 *        description: Cannot find user
 *      500:
 *        description: Some error happened
 */