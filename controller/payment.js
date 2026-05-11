const paymentModel = require('../model/payment');
const groupModel = require('../model/group');
const userModel = require('../model/user');
const otpGenerator = require('otp-generator');
const axios = require('axios');
 
exports.initiatePayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {groupId} = req.params;
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const group = await groupModel.findById(groupId)
        if(!group){
            return res.status(404).json({
                message: 'group not found'
            })
        }
        const member = group.members.find(member => member.toString() === userId);
        if(!member){
            return res.status(403).json({
                message: 'You are not a member of this group'
            })
        }

        const ref= otpGenerator.generate(12, {specialChars: true , upperCaseAlphabets:true ,lowerCaseAlphabets:true})

        const reference = `TCA-Splita-${ref}`;
        const paymentData = {
            amount: Number(group.contributionAmount),
            currency: 'NGN',
            reference,
            customer:{
                email: user.email,
                name: user.fullname
            },
            redirect_url: 'https://www.google.com/'
        }
        const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData,{
           
            headers: {
                Authorization: `Bearer ${process.env.KORA_API_KEY}`
            }
        });
        const payment = new paymentModel({
            amount: Number(group.contributionAmount),
            userId,
            groupId,
            groupName: group.groupname,
            reference,
        })
        await payment.save();
        res.status(200).json({
            message: 'Payment initiated successfully',
            data: response.data?.data
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'error initializing payment'
        })
    }
}

exports.veryfyPayment = async (req, res) => {
    try {
        const {reference} = req.query;
        const {data} = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.KORA_API_KEY}`
            }
        });
        const payment = await paymentModel.findOne({reference})
            if(!payment){
                console.log(payment)
                return res.status(404).json({
                    message: 'Payment not found'
                })
            }
        if(data?.status === true && data?.data.status === 'success'){
            payment.status = data?.data.status;
            await payment.save();
            res.status(200).json({
                message: 'Payment verified successfully',
                data:payment
            })    
        }else{
            payment.status = data?.data.status ;
            await payment.save();
            res.status(200).json({
                message: 'Payment verified successfully',
                data:payment
            }) 
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'error verifying payment'
        })
    }
}

exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        }

        const allPayments = (await paymentModel.find({userId}).sort({createdAt: -1}));
        res.status(200).json({
            message: ' All payment by user',
            data: allPayments
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'error fetching payment history'
        })
    }
}
