const express = require('express');
const router = express.Router();
const salesOrderController = require('../controllers/SalesOrderController');
const authController = require('../controllers/AuthController');
const jwtHelper = require('../config/jwtHelper');


router.post('/', salesOrderController.storeSalesOrder); // store a sale order
router.get('/', jwtHelper.verifyJwtToken, authController.verifyUser, salesOrderController.getListOfSalesOrders); // get list of sales order
router.get('/latest', jwtHelper.verifyJwtToken, authController.verifyUser, salesOrderController.getLatestSalesOrder); // new sales orders in the last 7 days
router.get('/revenue', jwtHelper.verifyJwtToken, authController.verifyUser, salesOrderController.revenueSalesOrders); // revenue contacts
router.get('/:id', salesOrderController.getSalesOrder); // get a sale order
router.put('/:id', salesOrderController.updateSalesOrder); // update a sale order
router.post('/delete', salesOrderController.deleteMultiSalesOrders); // delete multi sales orders
router.delete('/:id', salesOrderController.deleteSalesOrder); // delete a sale order
router.get('/search/:contactName', salesOrderController.findSalesOrder); // find sales order by contact name


module.exports = router;
