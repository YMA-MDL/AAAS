const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

// create the schema
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    organisations: [{
        type: Schema.Types.ObjectId,
        ref: 'organisation'
    }],
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    activitiesCreated: [{
        type: Schema.Types.ObjectId,
        ref: 'activity'
    }],
    activitiesAssigned: [{
        type: Schema.Types.ObjectId,
        ref: 'activity'
    }]
})

userSchema.pre('save', async function (next) {
    try {
        // generate a salt
        const salt = await bcrypt.genSalt(10)
        // generate a password hash (salt + hash)
        const passwordHash = await bcrypt.hash(this.password, salt)
        this.password = passwordHash
        next()
    } catch (error) {
        next(error)
    }

})


userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password)
    } catch (error) {
        throw new error(error)
    }
}
// create the model for users and expose it to our app

// create a model
const User = mongoose.model('user', userSchema)


// export the model
module.exports = User