const SalesOrder = require('../models/SalesOrder');
const Contact = require('../models/Contacts');
const  { mutipleMongooseToObject } = require('../helpers/mongoose');
const apiResponse = require('../helpers/apiResponse');

/*
SalesOrderController contains function handlers to handle request from Sales order page.
It will recieve the data from client, send to its model and vice versa.
This model will interact with database to store or update data.
*/
class SalesOrderController {
    // [POST] /sales_order - function to store a sale order information
    storeSalesOrder = async(req, res) =>{
      const { contactName } = req.body;
      const contact = await Contact.findOne({ contactName })
      let saleOrder = new SalesOrder(req.body);
      saleOrder.assignedTo = contact.assignedTo;
      await saleOrder.save()
      return apiResponse.successResponse(res, 'Add sale order successfully');
    }

    // [GET] /sales_order - function to get a list of sales order information
    getListOfSalesOrders = async (req, res) =>{
      try{
        const condition = {};
        let limit = 8;
        let page = 0;
        let total = 0;
        if (req.query.keyword != undefined && req.query.keyword != '') {
          let keyword = req.query.keyword.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
          condition.subject = {$regex: '.*' + keyword.trim() + '.*', $options: 'i'};
        }
        if (req.query.status != undefined && req.query.status != '' && req.query.status != '-1') {
          condition.status = req.query.status;
        }
        /* Pagination */
        if (req.query.limit != undefined && req.query.limit != '') {
          const number_limit = parseInt(req.query.limit);
          if (number_limit && number_limit > 0) {
            limit = number_limit;
          }
        }
        if (req.query.page != undefined && req.query.page != '') {
          const number_page = parseInt(req.query.page);
          if (number_page && number_page > 0) {
            page = number_page;
          }
        }
        /* Pagination */
        const isAdmin = req.isAdmin;
        if(!isAdmin){
          condition.assignedTo = req.username;
          let salesOrder = await SalesOrder
            .find(condition)
            .limit(limit)
            .skip(limit * page);
          total = await SalesOrder.countDocuments(condition);
          console.log(salesOrder)
          if(salesOrder.length > 0)
            return apiResponse.successResponseWithData(res, 'Success', {
              salesOrder: mutipleMongooseToObject(salesOrder),
              total,
              page,
              limit
            });
          else return apiResponse.successResponseWithData(res, 'Success', {
            salesOrder:[],
            total: 0,
            page,
            limit
          });
        }
        else{
          let salesOrder = await SalesOrder
            .find(condition)
            .limit(limit)
			      .skip(limit * page);
          total = await SalesOrder.countDocuments(condition);
          if(salesOrder.length > 0)
            return apiResponse.successResponseWithData(res, 'Success', {
              salesOrder: mutipleMongooseToObject(salesOrder),
              total,
              page,
              limit
            });
          else return apiResponse.successResponseWithData(res, 'Success', {
              salesOrder:[],
              total: 0,
              page,
              limit
            });
        }
      }catch(err){
        console.log(err);
        return apiResponse.ErrorResponse(res, err);
      }
    }

    // [GET] /sales_order/:id - function to get a sale order information by sale order ID
    getSalesOrder(req, res){
        let saleOrderId = req.params.id;
        try{
            SalesOrder
                .findOne({ _id: saleOrderId })
                .then((saleOrder) => {
                    return apiResponse.successResponseWithData(res, 'Success', { saleOrder: saleOrder });
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [PUT] /sales_order/:id - function to update a sale order information by sale order ID
    updateSalesOrder(req, res){
        let saleOrderId = req.params.id;
        let saleOrderInfo = req.body;
        setTimeout(() => {
            try{
                SalesOrder
                    .updateOne({ _id: saleOrderId }, saleOrderInfo)
                    .then(() => {
                        return apiResponse.successResponse(res, 'Update sale order successfully');
                    });
            } catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [DELETE] /sales_order/:id - function to delete a sale order information by sale order ID
    deleteSalesOrder(req, res){
        let saleOrderId = req.params.id;
        setTimeout(() => {
            try{
                SalesOrder
                    .remove({ _id: saleOrderId })
                    .then(() => {
                        return apiResponse.successResponse(res, 'Delete sale order successfully');
                    });

            } catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [POST] /delete - function to delete multi sales orders information by list of sales orders ID
    deleteMultiSalesOrders(req, res){
        let salesOrderIds = req.body;
        setTimeout(() => {
            try{
                SalesOrder
                    .remove({ _id: { $in : salesOrderIds } })
                    .then(() => {
                        return apiResponse.successResponse(res, 'Delete sales orders successfully');
                    });

            } catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [GET] /latest - function to find sales orders by subject
    findSalesOrder(req, res){
        let contactName = req.params.contactName;
        try {
            SalesOrder
                .find({ contactName : contactName })
                .then((salesOrder) => {
                    return apiResponse.successResponseWithData(res, 'Success', { salesOrder: salesOrder });
                })
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    getLatestSalesOrder = async (req, res) => {
      try {
        const today = new Date();
        const condition = {
          createdTime: { $lte: today - 7 }
        };
        let limit = 8;
        let page = 0;
        let total = 0;

        /* Pagination */
        if (req.query.limit != undefined && req.query.limit != '') {
          const number_limit = parseInt(req.query.limit);
          if (number_limit && number_limit > 0) {
            limit = number_limit;
          }
        }
        if (req.query.page != undefined && req.query.page != '') {
          const number_page = parseInt(req.query.page);
          if (number_page && number_page > 0) {
            page = number_page;
          }
        }
        /* Pagination */
        const isAdmin = req.isAdmin;
        if(isAdmin){
          let salesOrder = await SalesOrder
            .find(condition)
            .limit(limit)
            .skip(limit * page);
          total = await SalesOrder.countDocuments(condition);
          return apiResponse.successResponseWithData(res, 'Success', {
            salesOrder: mutipleMongooseToObject(salesOrder),
            total,
            page,
            limit
          });
        }
      }catch (err) {
        return apiResponse.ErrorResponse(res, err);
      }
    }
}

module.exports = new SalesOrderController();
