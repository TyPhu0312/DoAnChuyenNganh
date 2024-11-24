const express = require('express');
const router = express.Router();
const { createGallery, getGallery, getGalleryById, updateGallery, deleteGallery } = require('../controller/gallery.controller');

router.get('/', getGallery);
router.get('/:id', getGalleryById)
router.post('/create', createGallery);
router.put('/update/:id', updateGallery);
router.delete('/delete/:id', deleteGallery);

module.exports= router;