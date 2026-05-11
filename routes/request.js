const router = require('express').Router();
const {checkLogin} = require('../middleware/auth');
const { acceptRequest, AllrequestsForAdmin ,rejectRequest, createRequest} = require('../controller/request');

router.post('/request/:id', checkLogin, createRequest)
router.put('/accept-request/:id', checkLogin, acceptRequest)

router.get('/request/:groupId', checkLogin, AllrequestsForAdmin)

router.put('/request/reject/:requestId', checkLogin, rejectRequest)

module.exports = router;