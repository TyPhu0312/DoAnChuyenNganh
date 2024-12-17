const express = require('express');
const router = express.Router(); 
const { login, logout } = require('../controller/auth.controller');

router.post('/logout', logout);
router.post('/login', login);

module.exports = router;
