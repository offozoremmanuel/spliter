const router = require('express').Router()
const {checkLogin} = require('../middleware/auth')
const { createGroup } = require('../controller/group')

router.post('/group', checkLogin, createGroup)

module.exports = router