const userModel = require('../model/user')
const cloudinary = require('../middleware/cloudinary')
const fs = require('fs');
const {brevo} = require('../utils/brevo')
const bcryot = require('bcrypt')
const emailTemplate = require('../email')
const jwt = require('jsonwebtoken')

exports.createUser = async(req, res)=>{
    try {

        const {fullname,email,phoneNumber,password}= req.body

        const salt = await bcryot.genSalt(10)
        const hashedPassword = await bcryot.hash(password, salt)

        const newUser = new userModel({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword
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
        if(Date.now() > user.otpExpire){
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
        const user = await userModel.findOne({ email: email })

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
        if (user.isVerified = false) {
            return res.status(400).json({
                message: 'Please verify your email'
            })
        };

        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.SECERT_KEY,
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