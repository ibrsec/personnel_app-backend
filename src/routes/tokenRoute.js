'use strict';

const { token } = require('../controllers/tokenController');


const router = require('express').Router();


router.route('/')
.get(token.list)
.post(token.create)

router.route('/:id')
.get(token.read)
.put(token.update)
.delete(token.delete)

module.exports = router;