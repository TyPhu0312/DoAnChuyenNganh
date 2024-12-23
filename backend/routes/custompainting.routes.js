const express = require('express');
const router = express.Router();
const upload = require('../controller/multer.controller');
const {updatePriceCustomPainting,getCustomPaintingByUser,updatePaintingStatus, createCustomPainting, getCustomPainting, getCustomPaintingById, updateCustomPainting, deleteCustomPainting } = require('../controller/custompainting.controller');

router.get('/', getCustomPainting);
router.get('/:id', getCustomPaintingById)
router.get('/user/:id', getCustomPaintingByUser)
router.put('/update/:id', updateCustomPainting);
router.put('/updateprice/:id', updatePriceCustomPainting);
router.delete('/delete/:id', deleteCustomPainting);
router.post('/create', upload.single('image'), createCustomPainting);
router.put('/updatestatus/:id',updatePaintingStatus);
module.exports= router;