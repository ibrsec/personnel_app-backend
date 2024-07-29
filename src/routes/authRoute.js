"use strict";

const router = require('express').Router();
const {auth} = require('../controllers/authController');
router.route('/login').post(auth.login)
router.route('/logout').get(auth.logout)
router.route('/current').get(auth.current)





module.exports = router;


