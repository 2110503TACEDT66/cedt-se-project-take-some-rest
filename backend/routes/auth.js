const express = require('express')
const router = express.Router()

// Import controller
const { register, login, logout } = require('../controllers/auth')

// Auth router
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

module.exports = router

/**
 * @swagger
 * tags:
 *  name: Authorization
 */
/**
 * @swagger
 * tags:
 *  name: EPIC 1 - Exploring Campground
 *  description: Customer Exploring Campground
 */
/**
 * @swagger
 * tags:
 *  name: EPIC 2 - Campground Owner
 *  description: Managing your campground
 */
/**
 * @swagger
 * tags:
 *  name: EPIC 1 & 2
 *  description: API that is used on both EPIC 1 and EPIC 2
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *    summary: Register new user
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
 *    summary: Log-in
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
 *    summary: Log-out
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
 *    summary: Get my profile
 *    tags: [Authorization]
 *    responses :
 *      200 :
 *        description : successfully
 *      500 :
 *        description : Some server error
 */
