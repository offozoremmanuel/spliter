const router = require('express').Router();
const { createUser, updateProfile, verifyEmail, login, forgetPassword, resetPassword, changePasword,loginWithGoogle} = require('../controller/user');
const {checkLogin} = require('../middleware/auth')
const { upload } = require('../middleware/multer');
const {profile, loginProfile} = require('../middleware/passport')
const { signUpValidator, resetPasswordValidator, changePasswordValidator } = require('../middleware/validator')

 router.post('/user', signUpValidator,createUser);
 router.put('/update/:id', upload.single('profilePicture'), updateProfile);
 router.post('/user/check',upload.single(), verifyEmail)
 router.post('/login',upload.single(), login)

 router.post('/forget-password',forgetPassword)
 router.post('/reset-password',resetPasswordValidator,resetPassword)
 router.post('/change-password',checkLogin,changePasswordValidator,changePasword)

 router.get('/auth/google', profile)
 router.get('/auth/google/callback',loginProfile, loginWithGoogle)


 module.exports = router