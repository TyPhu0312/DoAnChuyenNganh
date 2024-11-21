const express = require('express');
const router = express.Router();
//const authenticationJWT = require('../middleware/authenticationJWT.js');
const { getUser, getUserById, createUser, updateUser, deleteUser  } = require('../controller/user.controller');

router.get('/', getUser);
router.get('/:id', getUserById );
//router.get('/info', authenticationJWT, getUserInfo);
router.post('/create', createUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;