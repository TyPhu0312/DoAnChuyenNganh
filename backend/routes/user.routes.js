const express = require('express');
const router = express.Router();
const authenticationJWT = require('../middleware/authenticationJWT.js');
const { getUsers, getUserById, getUserInfo, updateUser, deleteUser  } = require('../controller/user.controller.js');

router.get('/', getUsers);
router.get('/:id', getUserById );
router.get('/info', authenticationJWT, getUserInfo);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;