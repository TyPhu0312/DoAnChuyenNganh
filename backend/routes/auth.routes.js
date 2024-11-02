const express = require('express');
const router = express.router();
const {login, register, logout, adminLogin} = require('../controller/auth.controller.js');
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/adminLogin', adminLogin);

module.exports = router;

