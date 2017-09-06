const mongoose = require('mongoose')
const Schema = mongoose.Schema


// create the schema
const activitySchema = new Schema({
    title: {
        type: String,
        default: "no title",
        required: true
    },
    description: String,
    status : {
        type: String, 
        enum: ['new', 'in Progress', 'on Hold', 'Cancelled', 'Completed'],
        default: 'new'
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    targetDate: {
        start: Date,
        finish: Date
    },
    calculatedDate: {
        start: Date,
        finish: Date
    },
    selfConstrain: {
        duration: {
            type: Number,
            default : 1
        },
        unit: {
            type: String, 
            // http://momentjs.com/docs/#/manipulating/add/
            enum: ['y', 'Q', 'M', 'w', 'd','h','m','s','ms'],
            default: 'd',
        },
        start: {
            type: Date,
            default: Date.now()
        },
        finish: {
            type: Date,
        }
    },
    actualDate: {
        start: Date,
        finish: Date
    },
    dependsOn: [{
        offset: {
            type: Number,
            default: 0,
        },
        unit: {
            type: String,
            enum: ['H', 'D', 'W', 'M', 'Y'],
            default: 'D',
        },
        activity: {
            type: Schema.Types.ObjectId,
            ref: 'activity',
            required: true
        }
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    actor: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    created_on: {
        type: Date,
        default: Date.now(),
        required: true
    },
    comments: [{
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        created_on: {
            type: Date,
            default: Date.now(),
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }]
})

// create a model
const Activity = mongoose.model('activity', activitySchema)


// export the model
module.exports = Activity