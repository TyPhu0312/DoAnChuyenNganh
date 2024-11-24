const express = require('express');
const router = express.Router();
const { createProvider, getProvider, getProviderById, updateProvider, deleteProvider } = require('../controller/provider.controller');

router.get('/', getProvider);
router.get('/:id', getProviderById)
router.post('/create', createProvider);
router.put('/update/:id', updateProvider);
router.delete('/delete/:id', deleteProvider);

module.exports= router;