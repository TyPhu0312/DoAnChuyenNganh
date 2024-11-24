const express = require('express');
const router = express.Router();
const { createOrderDetail, getOrderDetail, getOrderDetailById, updateOrderDetail, deleteOrderDetail } = require('../controller/orderdetail.controller');

router.get('/', getOrderDetail);
router.get('/:id', getOrderDetailById)
router.post('/create', createOrderDetail);
router.put('/update/:id', updateOrderDetail);
router.delete('/delete/:id', deleteOrderDetail);

module.exports= router; 