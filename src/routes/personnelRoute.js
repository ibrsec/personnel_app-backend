'use strict';

const { personnel } = require('../controllers/personnelController');
const { isLogin,isAdminOrLead, isAdmin } = require('../middlewares/permissions');


const router = require('express').Router();


router.route('/')
.get(isLogin,personnel.list)
.post(personnel.create)

router.route('/:id')
.get(isLogin,personnel.read)
.put(isAdmin,personnel.update)
.patch(isAdmin,personnel.patchUpdate)
.delete(isAdmin,personnel.delete)

module.exports = router;