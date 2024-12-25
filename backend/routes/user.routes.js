const express = require('express');
const router = express.Router();
//const authenticationJWT = require('../middleware/authenticationJWT.js');
const {updateUserRole, getUser, getUserById, createUser, updateUser, deleteUser,checkUserForOrder  } = require('../controller/user.controller');

router.get('/', getUser);
router.get('/:id', getUserById );
router.get('/checkUserForOrder:id',checkUserForOrder)
router.post('/create', createUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.put('/:id/role', updateUserRole);

module.exports = router;