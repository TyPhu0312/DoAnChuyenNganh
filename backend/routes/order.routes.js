const express = require('express');
const router = express.Router();
const {getRevenueOverYears,getCurrentYearRevenue, createOrder, getOrder, getOrderById, updateOrder, deleteOrder } = require('../controller/order.controller');

router.get('/', getOrder);
router.get('/:id', getOrderById)
router.post('/create', createOrder);
router.put('/update/:id', updateOrder);
router.delete('/delete/:id', deleteOrder);
router.get('/getRevenue/year', getCurrentYearRevenue);
router.get('/getRevenue/over-years', getRevenueOverYears);

module.exports= router;