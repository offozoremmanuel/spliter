const router = require('express').Router()
const {checkLogin,adminAuth} = require('../middleware/auth')
const { createGroup, getAll, getOneGroup, removeMenberfromGroup } = require('../controller/group')
const { groupValidator } = require('../middleware/validator')

router.post('/',groupValidator, checkLogin, createGroup)

router.get('/', checkLogin,adminAuth, getAll )

router.get('/:id', checkLogin,adminAuth, getOneGroup)
router.delete('/:groupId/members/:memberId', checkLogin, adminAuth, removeMenberfromGroup)

module.exports = router