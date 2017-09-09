// load model
const User = require('../models/user')

// load libraries
const JWT = require('jsonwebtoken')
const { JWT_SECRET } = require('../auth')
const bcrypt = require('bcrypt')
const _ = require('lodash')

//---------------------------------------------------------------
// utility functions
//---------------------------------------------------------------

signToken = user => {
    return JWT.sign({
        iss: 'activitiesAPI',
        sub: user.id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current date + 1 day
    }, JWT_SECRET)
}

hashPassword = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//---------------------------------------------------------------
// routes' controllers
//---------------------------------------------------------------

module.exports = {
    getUser: (req, res, next) => {
        const id = req.params.id
        User.findOne({ _id:id })
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                next(err)
            })
    },
    getUsers: (req, res, next) => {
        User.find()
            .then(users => {
                var usersCleaned  = users
                res.status(200).json(users)
            })
            .catch(err => {
                next(err)
            })
    },

    updateUser: (req, res, next) => {
        res.status(200).json({
            message: 'You requested update user action (not implemented yet)'
        })
    },

    deleteUser: (req, res, next) => {
        res.status(200).json({
            message: 'You requested delete user action (not implemented yet)'
        })
    },

    signUp: async (req, res, next) => {
        console.log("req.body:", req.body)
        const { email, password } = req.body

        // check if user exists
        const foundUser = await User.findOne({ email })
        if (foundUser) {
            res.status(403).json({ error: 'email already in use' })
        }

        const newUser = new User()
        newUser.email = email
        newUser.password = password

        await newUser.save()

        // respond with token
        const token = signToken(newUser)

        res.status(200).json({ token })
    },

    signIn: async (req, res, next) => {
        const token = signToken(req.user)
        res.status(200).json({ token })
        console.log("login successfull")

    }
}