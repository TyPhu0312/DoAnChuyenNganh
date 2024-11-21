const express = require('express');
const router = express.Router();
const {createRole, deleteRole, getRole, getRoleById} = require('../controller/role.controller');

router.get('/', getRole)
router.get('/:id', getRoleById);
router.post('/create', createRole);
router.delete('/delete/:id', deleteRole);

module.exports = router;

