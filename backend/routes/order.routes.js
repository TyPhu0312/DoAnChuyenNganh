const express = require('express');
const router = express.Router();
const {getOrderByuserId,updateOrderStatus,getRevenueOverYears,getCurrentYearRevenue, createOrder, getOrder, getOrderById, updateOrder, deleteOrder } = require('../controller/order.controller');

router.get('/', getOrder);
router.get('/:id', getOrderById)
router.post('/create', createOrder);
router.put('/update/:id', updateOrder);
router.put('/updatestatus/:id', updateOrderStatus);
router.delete('/delete/:id', deleteOrder);
router.get('/getRevenue/year', getCurrentYearRevenue);
router.get('/getRevenue/over-years', getRevenueOverYears);
router.get('/getbyuserid/:userId', getOrderByuserId)

module.exports= router;