const express = require('express');
const router = express.Router();
const {getOrderDetailByorderId, createOrderDetail, getOrderDetail, getOrderDetailById, updateOrderDetail, deleteOrderDetail } = require('../controller/orderdetail.controller');

router.get('/', getOrderDetail);
router.get('/:id', getOrderDetailById)
router.get('/byorderid/:id', getOrderDetailByorderId)
router.post('/create', createOrderDetail);
router.put('/update/:id', updateOrderDetail);
router.delete('/delete/:id', deleteOrderDetail);

module.exports= router; 