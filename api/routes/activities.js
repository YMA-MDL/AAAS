// express load
const express = require('express')
const router = require('express-promise-router')()
const passport = require('passport')
const passportConf = require('../passport')

// controller load
const ActivitiesController = require('../controllers/activities')

// helpers load
const { validateBody, schemas } = require('../helpers/routeHelpers')

// passport strategies
const passportSignIn = passport.authenticate('local', { session: false })
const passportJWT =  passport.authenticate('jwt', { session: false })

//---------------------------------------------------------------
// Routes
//---------------------------------------------------------------

router.route('/')
    /**
     * @api {get} /api/activities Request Activities List
     * @apiName Get Activities
     * @apiDescription Returns all the activities either [Owned, Followed, Acted] by the Requestor
     * @apiGroup Activities Batch
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .get(passportJWT, ActivitiesController.getActivities)

    /**
     * @api {post} /api/activities Create a new Activity
     * @apiName Add Activity
     * @apiGroup Activities Item
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     * @apiParam {String} title  Activity title
     * @apiParam {String} [description]  Activity description
     * @apiParam {Number{0-100}} [progress]  Progress in %
     * @apiParam {Object} [targetDate]  Set of target dates
     * @apiParam {Object} [actualDate]  Set of actual dates
     * @apiParam {Object} [dependsOn]  Set of dependencies
     * @apiParam {Object} [selfConstrain]  Set of self constrains (like duration,...)
     * @apiSuccess (200) {Object}  activity       Activity
     *
     */
    .post(passportJWT, validateBody(schemas.activitySchema), ActivitiesController.addActivity)

router.route('/mine')

    /**
     * @api {get} /api/activities/mine Request The Users' owned Activities
     * @apiName Get My Activities
     * @apiGroup Activities Batch
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .get(passportJWT, ActivitiesController.getMyActivities)

router.route('/batch')

    /**
     * @api {post} /api/activities/batch Create New Activities
     * @apiName Add Activities
     * @apiGroup Activities Batch
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .post(passportJWT, ActivitiesController.newActivities)
    /**
     * @api {put} /api/activities/batch Update Activities
     * @apiName Update Activities
     * @apiGroup Activities Batch
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .put(passportJWT, validateBody(schemas.activitiesUpdateSchema), ActivitiesController.updateActivities)

    /**
     * @api {delete} /api/activities/batch Delete Activities
     * @apiName Delete Activities
     * @apiGroup Activities Batch
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .delete(passportJWT, ActivitiesController.deleteActivities)


router.route('/:id')

    /**
     * @api {get} /api/activities/:id Retrieve an Activity
     * @apiName Get Activity
     * @apiGroup Activities Item
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     * @apiSuccess (200) {Object}  activity       Activity
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *      {
                "_id": "599c2a0d1872462ababc55bd",
                "actor": "599701a86099b022b8f8bb69",
                "owner": "599701a86099b022b8f8bb69",
                "__v": 0,
                "comments": [],
                "created_on": "2017-08-22T12:51:17.676Z",
                "followers": [],
                "dependsOn": [],
                "progress": 0,
                "title": "Buy some Milk"
            }
     *
     */
    .get(passportJWT, ActivitiesController.getActivity)

    /**
     * @api {put} /api/activities/:id Update an Activity
     * @apiName Update Activity
     * @apiGroup Activities Item
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .put(passportJWT, validateBody(schemas.activityUpdateSchema), ActivitiesController.updateActivity)

    /**
     * @api {delete} /api/activities/:id Delete an Activity
     * @apiName Delete Activity
     * @apiGroup Activities Item
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .delete(passportJWT, ActivitiesController.deleteActivity)


router.route('/:id/comments')

    /**
     * @api {get} /api/activities/:id/comments Retrieve Comments for an Activity
     * @apiName Get Activity Comments
     * @apiGroup Activities Comments
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .get(passportJWT, ActivitiesController.getActivityComments)

    /**
     * @api {post} /api/activities/:id/comments Comment an Activity
     * @apiName Add Activity Comments
     * @apiGroup Activities Comments
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .post(passportJWT, validateBody(schemas.commentSchema), ActivitiesController.newComment)

router.route('/:id/comments/:commentId')

    /**
     * @api {get} /api/activities/:id/comments/:commentId Retrieve a Comment
     * @apiName Get Activity Comment
     * @apiGroup Activities Comments
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .get(passportJWT, ActivitiesController.getActivityComment)

    /**
     * @api {put} /api/activities/:id/comments/:commentId Update an Activity Comment
     * @apiName Update Activity Comment
     * @apiGroup Activities Comments
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .put(passportJWT, ActivitiesController.updateComment)


router.route('/:id/predecessors/:preId')
    /**
     * @api {get} /api/activities/:id/predecessors/:preId Get Predecessor Constrain
     * @apiName Retrieve Predecessor Constrain
     * @apiGroup Activities Constrains
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .get(passportJWT, ActivitiesController.getPredecessorConstrain)
    /**
     * @api {put} /api/activities/:id/predecessors/:preId Update Predecessor Constrain
     * @apiName Update Predecessor Constrain and Update impacted successors
     * @apiGroup Activities Constrains
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .put(passportJWT,validateBody(schemas.constrainUpdateSchema), ActivitiesController.updatePredecessorConstrain)
    /**
     * @api {delete} /api/activities/:id/predecessors/:preId Delete Predecessor Constrain
     * @apiName Delete Predecessor Constrain and Update impacted successors
     * @apiGroup Activities Constrains
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .delete(passportJWT, ActivitiesController.deletePredecessorConstrain)

router.route('/:id/successors')
    /**
     * @api {get} /api/activities/:id/successors Get Successors
     * @apiName Get Successors
     * @apiGroup Activities Constrains
     * @apiHeader (Headers) {String} authorization JWT Authorization value.
     * @apiPermission logged
     *
     */
    .get(passportJWT, ActivitiesController.getSuccessors)

module.exports = router