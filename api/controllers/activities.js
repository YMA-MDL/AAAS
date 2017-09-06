// load model
const Activity = require('../models/activity')

// load libraries
const _ = require('lodash')
const moment = require('moment')

//---------------------------------------------------------------
// utility functions
//---------------------------------------------------------------

findSuccessors = activityId => {
    return Activity.find(
        { 'dependsOn.activity': activityId }
    )
}

updateActivitiesCalculatedDates = activities => {
    activities.forEach(function (activity) {
        updateActivityCalculatedDate(activity)
    }, this);
}

updateActivityCalculatedDate = activity => {
    activity.populate('dependsOn').populate('activity')
    console.log("populated activity", activity)
    activity.dependsOn.forEach(function (constrain) {
        // update start
        // update finish
    }, this);
}

isRecursive = activityId => {
    // from an activityID check for recursion

}

//---------------------------------------------------------------
// routes' controllers
//---------------------------------------------------------------

module.exports = {
    getActivity: (req, res, next) => {
        Activity.findById(req.params.id)
            .then(activity => {
                res.status(200).json(activity)
            })
            .catch(err => {
                next(err)
            })
    },
    getActivities: (req, res, next) => {
        Activity.find({
            $or: [
                { 'actor': req.user.id },
                { 'owner': req.user.id },
                { 'followers': req.user.id }
            ]
        })
            .populate('owner').populate('comments').populate('followers')
            .then(activities => {
                res.status(200).json(activities)
            })
            .catch(err => {
                next(err)
            })
    },
    getMyActivities: (req, res, next) => {
        Activity.find({
            $or: [
                { 'actor': req.user.id },
                { 'owner': req.user.id }
            ]
        })
            .then(activities => {
                res.status(200).json(activities)
            })
            .catch(err => {
                next(err)
            })
    },
    addActivity: (req, res, next) => {
        const newAct = new Activity()
        const activity = req.body
        for (var key in activity) {
            if (activity.hasOwnProperty(key)) {
                newAct[key] = activity[key]
            }
        }
        newAct.owner = req.user.id
        newAct.actor = req.user.id
        newAct.save().then(activity => {
            res.status(200).json({ activity })
        })
    },
    newActivities: (req, res, next) => {
        console.log("called controller function newActivities")
    },
    updateActivity: (req, res, next) => {
        console.log("called controller function updateActivity")
        Activity.findById(req.params.id)
            .then(activity => {
                const activityUpdate = req.body
                for (var key in activityUpdate) {
                    if (activityUpdate.hasOwnProperty(key)) {
                        activity[key] = activityUpdate[key]
                    }
                }
                // check for dependency recursion
                activity.save().then(activity => {
                    // update successors
                    res.status(200).json({ activity })
                })
            })
    },
    updateActivities: (req, res, next) => {
        console.log("called controller function updateActivities")
    },
    deleteActivity: (req, res, next) => {
        console.log("called controller function deleteActivity")
        Activity.findByIdAndRemove(req.params.id).then(activity => {
            res.status(200).json(activity)
        })
    },
    deleteActivities: (req, res, next) => {
        console.log("called controller function deleteActivities")
    },
    newComment: (req, res, next) => {
        var commentCreator = req.user.id
        if (req.body.creator) commentCreator = req.body.creator

        Activity.findById(req.params.id)
            .then(activity => {
                activity.comments.push({
                    creator: req.user.id,
                    content: req.body.content
                })
                activity.save().then(activity => {
                    res.status(200).json(activity)
                })
            })
            .catch(err => {
                next(err)
            })

    },
    getActivityComment: (req, res, next) => {

    },
    getActivityComments: (req, res, next) => {
        Activity.findById(req.params.id).populate('comments')
            .then(activity => {
                var comments = activity.comments
                res.status(200).json(comments)
            })
            .catch(err => {
                next(err)
            })
    },
    updateComment: (req, res, next) => {

    },
    getPredecessorConstrain: (req, res, next) => {
        Activity.findById(req.params.id).populate('dependsOn')
            .then(activity => {
                var predecessor = _.find(activity.dependsOn, { 'id': req.params.preId })
                if (!predecessor) {
                    res.status(404).json({
                        "message": "predecessor not found"
                    })
                }
                res.status(200).json(predecessor)
            })
            .catch(err => {
                next(err)
            })
    },
    updatePredecessorConstrain: (req, res, next) => {
        Activity.findById(req.params.id).populate('dependsOn')
            .then(activity => {
                var constrainUpdate = _.find(activity.dependsOn, { 'id': req.params.preId })
                if (!constrainUpdate) {
                    res.status(404).json({
                        "message": "predecessor not found"
                    })
                }
                const activityConstrainUpdate = req.body
                for (var key in activityConstrainUpdate) {
                    if (activityConstrainUpdate.hasOwnProperty(key)) {
                        constrainUpdate[key] = activityConstrainUpdate[key]
                    }
                }
                activity.save().then(activity => {
                    // update successors
                    // if (changedStart) updateSuccessors(activity.id)
                    res.status(200).json({ activity })
                })
            })
            .catch(err => {
                next(err)
            })
    },
    deletePredecessorConstrain: (req, res, next) => {
        Activity.findById(req.params.id).populate('dependsOn')
            .then(activity => {
                activity.dependsOn = _.reject(activity.dependsOn, { 'id': req.params.preId })
                activity.save().then(activity => {
                    // if (changedStart) updateSuccessors(activity.id)
                    res.status(200).json({ activity })
                })
            })
            .catch(err => {
                next(err)
            })

    },
    getSuccessors: (req, res, next) => {

    }
}