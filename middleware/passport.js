const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../model/user')

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
 async(accessToken, refreshToken, profile, cb) => {
    try {
        console.log(profile)
        let user = await userModel.findOne({email: profile._json.email})

        if(!user){
            user = new userModel({
                fullname: profile._json.name,
                phoneNumber: `${Math.floor(Math.random() * 1E11)}`,
                email:profile._json.email,
                isVerified:profile._json.email_Verified,
                password:' ',
                profilePicture: profile._json.picture
                
            })
            await user.save()
        }
        return cb(null, user)
    } catch (error) {
        console.log('error signing up with google', error.message)
        return cb(null, error)
    }
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
 const User = await userModel.findById(id);

    if (!User){
        return cb(new Error('user not found'), null)
    }
    cb(null, User);
});

const profile= passport.authenticate('google', {scope:  ['profile', 'email']})

const loginProfile = passport.authenticate('google', {failureRedirect:'/login'})

module.exports ={
    passport,
    profile,
    loginProfile
}