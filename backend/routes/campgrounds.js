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
 *    Review:
 *      type: object
 *      required:
 *      - userId
 *      - campgroundId
 *      - comment
 *      - score
 *      properties:
 *        userId: 
 *          type: string
 *          example: 662f18753245db1a68cbe933
 *        campgroundId:
 *          type: string
 *          example: 662f177a3245db1a68cbe87f
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
 *      400 : 
 *        description : Bad request
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
* /api/campgrounds:
 *  get : 
 *    security:
 *      - bearerAuth: []
 *    summary: get filtered campground
 *    tags: [Exploring Campground]
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
 * /api/campgrounds/{cgid}/reviews:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: createReview
 *    tags: [Exploring Campground]
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
 *  get : 
 *    summary: get Reviews
 *    tags: [Exploring Campground]
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
 *        required: true
 *        description: Review Id
 *    responses:
 *      200:
 *        description: Delete Review Successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Some error happened
 * /api/users/my-bookmark/{cgid}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    summary: add campground to my bookmark
 *    tags: [Exploring Campground]
 *    parameters:
 *      - in: path
 *        name: cgid
 *        schema:
 *          type: string
 *        required: true
 *        description: Camgpground Id
 *    responses :
 *      200 :
 *        description : successfully add to bookmark
 *      400 :
 *        description : Bad Request
 *      500 :
 *        description : Some server error
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
 *        required: true
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
 *        required: true
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
 *        description: Approve request successfully
 *      404:
 *        description: Cannot find user
 *      500:
 *        description: Some error happened
 * /api/users/update-role/{ID}/reject:
 *  put:
 *    security:
 *      - bearerAuth: [] 
 *    summary: Reject request to be campground owner (admin)
 *    tags: [Campground Owner]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
 *    responses:
 *      200:
 *        description: Reject request successfully
 *      404:
 *        description: Cannot find user
 *      500:
 *        description: Some error happened
 * /api/campgrounds:
 *  post:
 *    security:
 *      - bearerAuth: [] 
 *    summary: Add my campground (campgroundOwner ,admin)
 *    tags: [Campground Owner]
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
 *    summary: View my campground (campgroundOwner)
 *    tags: [Campground Owner]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
 *    responses :
 *      200 :
 *        description : successfully
 *      500 :
 *        description : Some server error
 * /api/campgrounds/{cgid}:
 *  put:
 *    security:
 *      - bearerAuth: [] 
 *    summary: Update my campground (campgroundOwner)
 *    tags: [Campground Owner]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
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
 *    summary: Update my campground (campgroundOwner)
 *    tags: [Campground Owner]
 *    parameters:
 *      - in: path
 *        name: ID
 *        schema:
 *          type: string
 *        required: true
 *        description: User id
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
 * /api/reserves:
 *  get:
 *    security:
 *      - bearerAuth: [] 
 *    summary: Get Reserves
 *    tags: [Campground Owner]
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
 *    tags: [Campground Owner]
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
 *    tags: [Campground Owner]
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
 *    tags: [Campground Owner]
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
 * /api/reviews/{rvid}:
 *  put:
 *    security:
 *      - bearerAuth: [] 
 *    summary: Report Review
 *    tags: [Campground Owner]
 *    parameters:
 *      - in: path
 *        name: rvid
 *        schema:
 *          type: string
 *        required: true
 *        description: Reserve Id 
 *    responses :
 *      200 :
 *        description : report reserve successfully
 *      400 : 
 *        description : can't report reserve
 *      500 :
 *        description : Some server error
 * /api/reviews/reported-review:
 *  get:
 *    security:
 *      - bearerAuth: [] 
 *    summary: Get reported review
 *    tags: [Campground Owner]
 *    responses :
 *      200 :
 *        description : get reported reserve data successfully
 *      500 :
 *        description : Some server error
 * /api/campgrounds/{cgid}/sites/{sid}/upload-image:
 *  post:
 *    security:
 *      - bearerAuth: [] 
 *    summary: Upload campgroundSite's Picture
 *    tags: [Campground Owner]
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