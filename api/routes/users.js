// express load
const express = require('express')
const router = require('express-promise-router')()
const passport = require('passport')
const passportConf = require('../passport')

// helpers load
const { validateBody, schemas } = require('../helpers/routeHelpers')

// controller load
const UsersController = require('../controllers/users')

// passport strategies
const passportSignIn = passport.authenticate('local', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

 /*
 * @apiSampleRequest
 */

router.route('/')

    /**
     * @api {get} /api/users Retrieve Users
     * @apiName Get Users
     * @apiGroup 0-Users
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     *
     * 
     */
    .get(passportJWT, UsersController.getUsers)

router.route('/:id')

    /**
     * @api {get} /api/users/:id Retrieve a User
     * @apiName Get User
     * @apiGroup 0-Users
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiParam {String} id Users unique ID.
     *
     * @apiUse UserNotFoundError
     * 
     * 
     */
    .get(passportJWT, UsersController.getUser)

    /**
     * @api {put} /api/users/:id Update User information
     * @apiName Update User
     * @apiGroup 0-Users
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiParam {String} id Users unique ID.
     *
     * @apiUse UserNotFoundError
     * 
     * 
     */
    .put(passportJWT, UsersController.updateUser)

    /**
     * @api {delete} /api/users/:id Delete User
     * @apiName Delete User
     * @apiGroup 0-Users
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiParam {String} id Users unique ID.
     *
     * @apiUse UserNotFoundError
     * 
     * 
     */
    .delete(passportJWT, UsersController.deleteUser)

router.route('/signup')

    /**
     * @api {post} /api/users/signup Sign up
     * @apiName SignUp
     * @apiGroup 0-Users
     * @apiParam {String} email email of the user.
     * @apiParam {String} password password.
     * @apiParamExample {json} Request-Example:
                 { "email": "john.doe@ABC.com", "password": "secret" }
     *
     * 
     */
    .post(validateBody(schemas.authSchema), UsersController.signUp)

router.route('/signin')
    /**
     * @api {post} /api/users/signin Sign in
     * @apiName SignIn
     * @apiGroup 0-Users
     * @apiParam {String} email email of the user.
     * @apiParam {String} password password.
     * @apiParamExample {json} Request-Example:
                 { "email": "john.doe@ABC.com", "password": "secret" }
     *
     * @apiUse UserNotFoundError
     * 
     * 
     */
    .post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn)

module.exports = router