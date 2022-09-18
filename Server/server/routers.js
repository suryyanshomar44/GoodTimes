"use strict"
const Express = require('express');
const router = Express.Router();
const user = require('./user');
const guest = require("./guest");
const admin = require("./admin");

router.use('/user', user);
router.use('/guest', guest);
router.use('/admin', admin);


module.exports = router;