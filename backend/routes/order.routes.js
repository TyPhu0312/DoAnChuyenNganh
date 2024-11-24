const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getOrderById, updateOrder, deleteOrder } = require('../controller/order.controller');

router.get('/', getOrder);
router.get('/:id', getOrderById)
router.post('/create', createOrder);
router.put('/update/:id', updateOrder);
router.delete('/delete/:id', deleteOrder);

module.exports= router;