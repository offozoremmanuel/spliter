const router = require('express').Router()
const {checkLogin} = require('../middleware/auth')
const { createGroup, getAll, getOneGroup } = require('../controller/group')
const { groupValidator } = require('../middleware/validator')

router.post('/group',groupValidator, checkLogin, createGroup)

router.get('/group', checkLogin, getAll )

router.get('/group/:id', checkLogin, getOneGroup)

module.exports = router