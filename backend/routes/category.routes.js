const express = require('express');
const router = express.Router();
const { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } = require('../controller/category.controller');

router.get('/', getCategory);
router.get('/:id', getCategoryById)
router.post('/create', createCategory);
router.put('/update/:id', updateCategory);
router.delete('/delete/:id', deleteCategory);

module.exports= router;