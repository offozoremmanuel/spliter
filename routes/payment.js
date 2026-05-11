const router = require('express').Router();
const { initiatePayment, veryfyPayment, getPaymentHistory } = require('../controller/payment')
const { initiatePaystackPayment, veryfyPaystackPayment } = require('../controller/paystack')
const {checkLogin} = require('../middleware/auth')

router.post('/payment/:groupId', checkLogin, initiatePayment)

router.post('/payment-paystack/:groupId', checkLogin, initiatePaystackPayment)

router.get('/payment-verify', checkLogin, veryfyPayment)

router.get('/payment-paystack-verify', checkLogin, veryfyPaystackPayment)

router.get('/payment-history', checkLogin, getPaymentHistory)

module.exports = router
