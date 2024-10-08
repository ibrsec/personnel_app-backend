'use strict';

const { token } = require('../controllers/tokenController');
const { isAdmin } = require('../middlewares/permissions');


const router = require('express').Router();

router.use(isAdmin);


router.route('/')
.get(token.list)
.post(token.create)

router.route('/:id')
.get(token.read)
.put(token.update)
.delete(token.delete)

module.exports = router;