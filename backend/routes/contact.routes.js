const express = require('express');
const router = express.Router();
const upload = require('../controller/multer.controller');
const {getContact, getContactByUserIdAndPaintingId, createContact, updateContact, deleteContact} = require('../controller/contact.controller')
router.get('/', getContact);
router.get('/:userId/:customPaintingId', getContactByUserIdAndPaintingId);
router.put('/update/:id', updateContact);
router.delete('/delete/:id', deleteContact);
router.post('/create', upload.single('image'), createContact);
router.post('/create',createContact);
module.exports= router;