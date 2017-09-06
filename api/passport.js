const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET } = require('./auth')
const User = require('./models/user')

// JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {

        //console.log("payload",payload)
        // Find the user specified in token
        const user = await User.findById(payload.sub)

        //console.log("user",user)
        // If user doesn't exist, handle it
        if (!user) {
            return done(null, false)
        }

        // Otherwise return the user
        done(null, user)

    } catch (error) {
        done(error, false)
    }
}))



// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        // find the user given the email
        const user = await User.findOne({ email })

        // if not handle it
        if (!user) {
            return done(null, false)
        }

        // check if the password is correct and handle if not
        if (!user.isValidPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, user);
        // otherwise
    } catch (error) {
        done(error, false)
    }


}))