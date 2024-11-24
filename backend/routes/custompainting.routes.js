const express = require('express');
const router = express.Router();
const { createCustomPainting, getCustomPainting, getCustomPaintingById, updateCustomPainting, deleteCustomPainting } = require('../controller/custompainting.controller');

router.get('/', getCustomPainting);
router.get('/:id', getCustomPaintingById)
router.post('/create', createCustomPainting);
router.put('/update/:id', updateCustomPainting);
router.delete('/delete/:id', deleteCustomPainting);

module.exports= router;