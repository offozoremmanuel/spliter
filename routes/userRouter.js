const router = require('express').Router();
const { createUser, updateProfile, verifyEmail, login} = require('../controller/user');
const { upload } = require('../middleware/multer');

 router.post('/user', createUser);
 router.put('/update/:id', upload.single('profilePicture'), updateProfile);
 router.post('/user/check', verifyEmail)
 router.post('/login', login)


 module.exports = router