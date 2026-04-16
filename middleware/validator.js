const joi = require('joi');

exports.signUpValidator = (req,res, next) =>{
    const schema = joi.object({
        fullname: joi.string().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
            'any.required':"full Name is required",
            'string.empty':"Fullname cannot be empty",
            'string.pattern.base': "fullname cannot  contain numbers and must be at least 4 characters"
        }),
        email: joi.string().email().required().messages({
            'any.required':"email is required",
            'string.empty':"email cannot be empty",
            'string.email': "email must be a valid email"
        }),
         phoneNumber: joi.string().pattern(/^\d{11}$/).required().messages({
            'any.required':"Phone number is required",
            'string.empty':"Phone number cannot be empty",
            'string.pattern.base': "Phone Number must only contain digits and be 11 digits"
        }),
         password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"password is required",
            'string.empty':"password cannot be empty",
            'string.pattern.base': "password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        }),
    })
    const {error} = schema.validate(req.body);

    if (error){
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}
exports.groupValidator = (req, res, next) => {
    const schema = joi.object({
        groupname: joi.string().trim().pattern(/^[A-Za-z\s]{6,}$/).required().messages({
            'any.required': 'Group name is required',
            'string.empty': 'Group name cannot be Empty',
            'string.pattern.base': 'Group name cannot contain numbers and must be at least 6 characters'
        }),
        contributionAmount: joi.string().pattern(/^\d+(\.\d{1,2})?$/).required().messages({
            'any.required': 'Contribution amount is required',
            'string.pattern.base': 'Amount must be a valid number'
        }),
        contributionFrequency: joi.string().required(),
        payoutFrequency: joi.string().required(),
        describeGroup: joi.string().min(10).required(),
        totalMembers: joi.number().min(2).max(12).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
};

exports.resetPasswordValidator = (req,res, next) =>{
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required':"email is required",
            'string.empty':"email cannot be empty",
            'string.email': "email must be a valid email"
        }),
         otp: joi.string().pattern(/^\d{6}$/).required().messages({
            'any.required':"OTP is required",
            'string.empty':"OTP cannot be empty",
            'string.pattern.base': "OTP must only contain digits and be 6 digits"
        }),
         password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"password is required",
            'string.empty':"password cannot be empty",
            'string.pattern.base': "password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        }),
        confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
            'any.required':"confirm password is required",
            'any.only': "confirm password must match password"
        }),
    })
    const {error} = schema.validate(req.body);

    if (error){
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}
exports.changePasswordValidator = (req,res, next) =>{
    const schema = joi.object({
            oldPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"Old password is required",
            'string.empty':"Old password cannot be empty",
            'string.pattern.base': "Old password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        }),
        newpassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"New password is required",
            'string.empty':"New password cannot be empty",
            'string.pattern.base': "New password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        }),
        confirmPassword: joi.string().valid(joi.ref('newpassword')).required().messages({
            'any.required':"confirm password is required",
            'any.only': "confirm password must match new password"
        }),
    })
    const {error} = schema.validate(req.body);

    if (error){
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}