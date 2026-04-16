const userModel = require('../model/user')
const cloudinary = require('../middleware/cloudinary')
const fs = require('fs');
const {brevo} = require('../utils/brevo')
const bcryot = require('bcrypt')
const {emailTemplate,resetPasswordTemplate,resetPasswordSuccessfulTemplate} = require('../email')
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator')


exports.createUser = async(req, res)=>{
    try {

        const {fullname,email,phoneNumber,password}= req.body;
        const otp = otpGenerator.generate(6,{upperCaseAlphabets:false, lowerCaseAlphabets: false, specialChars:false});



        const salt = await bcryot.genSalt(10)
        const hashedPassword = await bcryot.hash(password, salt)

        const newUser = new userModel({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            otp
        })
        brevo(newUser.email, newUser.fullname, emailTemplate(newUser.fullname, newUser.otp))
        await newUser.save()
        
        res.status(201).json({
            message: "User created successfully",
            data: newUser
        })
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        })
    }
}


exports.updateProfile = async(req, res)=>{
    try {
        const files = req.file;
        console.log(files)
        const filePath = files['path']

        const uploadToCloudinary = await cloudinary.uploader.upload(filePath);
        const extractSecureurl = {secureUrl:uploadToCloudinary.secure_url, publicId: uploadToCloudinary.public_id}
        console.log(`hello: `, extractSecureurl)
        fs.unlinkSync(filePath)


        const {bankName, accountNumber} = req.body
        const {id}= req.params
        console.log('ID:',id);
        
        const user = await userModel.findById(id);
        console.log('user:',user);
        
        const updateUser = await userModel.findByIdAndUpdate(id, 
        {
            bankName,
            accountNumber,
            profilePicture: extractSecureurl
        },
        {
        new: true
        })
        res.status(200).json({
            message: "User profile updated successfully",
            data: updateUser
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating user profile",
            error: error.message
        })
    }
}

exports.verifyEmail = async (req, res)=>{
    try {
        const {email, otp}=req.body
        const user = await userModel.findOne({ email: email})
        console.log(user)
        if(!user){
            return res.status(404).json({
                message:'User not found'
            })
        }
        if(Date.now() > user.otpExpire || user.otp !== otp){
            return res.status(400).json({
                message: 'OTP expired'
            })
        }
        user.isVerified = true
        await user.save()
        res.status(200).json({
            message: 'OTP Verified successfully',
            data: user
        })
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({ email: email.toLowerCase() })

        if (!user){
            return res.status(404).json({
                message: 'Invalid Credentials'
            })
        }

        const correctPassword = await bcryot.compare(password, user.password)

        if (!correctPassword) {
            return res.status(400).json({
                message: 'Invalid Credentials'
            })
        }
        if (user.isVerified == false) {
            return res.status(400).json({
                message: 'Please verify your email'
            })
        };

        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.SECRET_KEY,
            {expiresIn: '1d'}
        );

        res.status(200).json({
            message: 'Login successfull',
            token,
            user
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: `Something went wrong`
        })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const {email} = req.body
        const user = await userModel.findOne({ email: email.toLowerCase() })

        if (user == null){
            return res.status(404).json({
                message: 'invalid credentials'
            })
        }
        // Generate OTP
        const OTP = Math.round(Math.random() * 1e6).toString().padStart(6, "0");
        // Save OTP and expiration time to user document
        user.otp = OTP
        user.otpExpire = Date.now() +( 1000 * 60 * 7) // OTP valid for 7 minutes
    
        const data = {
            name: user.fullname,
            otp:OTP
        }

        // Send OTP via email
        await brevo(email,user.fullname, resetPasswordTemplate(data));
        // save the changes to our database
        await user.save()

        res.status(200).json({
            message: 'OTP sent successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const {email, otp, Password} = req.body
        const user = await userModel.findOne({ email: email.toLowerCase() })
        // Check if user exists
        if (user == null){
            return res.status(404).json({
                message: 'invalid credentials'
            })
        }
        if(Date.now() > user.otpExpire || user.otp !== otp){
            return res.status(400).json({
                message:'invalid OTP'
            })
        }
        const salt = await bcryot.genSalt(10)
        const hashedPassword = await bcryot.hash(Password, salt)
        user.password = hashedPassword
        await user.save()
        
        const data = {
            name: user.fullname,
            otp:user.otp
        }
        await brevo(email,user.fullname, resetPasswordSuccessfulTemplate(data));
        res.status(200).json({
            message: 'Password reset successfully'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.changePasword = async (req,res) =>{
    try {
        const {id} = req.params
        const {oldPassword, newPassword} = req.body;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const checkPassword = await bcryot.compare(oldPassword, user.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: 'old password is Invalid '
            })
        }  
        const salt = await bcryot.genSalt(10);
        const hashedPassword = await bcryot.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            message: 'Password changed successfully'
        }) 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.loginWithGoogle = async (req, res) =>{
    try {
        const token = await jwt.sign({
            id: req.user._id,
            role:req.user.role
        },process.env.SECRET_KEY,{expiresIn: '1d'}) 
        res.status(200).json({
            message: 'login successful',
            data: req.user.fullname,
            token
        })
    } catch (error) {
         console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}
