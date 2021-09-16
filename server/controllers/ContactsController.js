const Contacts = require('../models/Contacts');
const  { mutipleMongooseToObject } = require('../helpers/mongoose');
const apiResponse = require('../helpers/apiResponse');

/*
ContactsController contains function handlers to handle request from Contacts page.
It will recieve the data from client, send to its model and vice versa.
This model will interact with database to store or update data.
*/
class ContactsController {
    // [POST] /contacts - function to store a contact information
    storeContact = async (req, res) => {
      try{
        const contacts = new Contacts(req.body);
        await contacts.save()
        return apiResponse.successResponse(res, 'Add contact successfully');
      }catch(err){
        return apiResponse.ErrorResponse(res, err);
      }
    }

    // [GET] /contacts/revenue - function to get the revenue figures of contacts
    revenueContacts = async (req, res) => {
      try {
        let condition = {};
        if(!req.isAdmin) condition.assignedTo = req.username
        const pipeline = [
          {
            '$match': condition
          },
          {
            '$group': {
              '_id': "$leadSrc",
              'count': { '$sum': 1 }
            }
          }
        ];
        const contacts = await Contacts.aggregate(pipeline);
        const total = await Contacts.countDocuments(condition);
        return apiResponse.successResponseWithData(res, 'Success', {
          contacts,
          total
        });
      } catch(err){
        return apiResponse.ErrorResponse(res, err);
      }
    }

    // [GET] /contacts - function to get a list of contacts information
    getListOfContacts = async (req, res) => {
      try {
        /* Condition area */
        const condition = {};
        let limit = 8;
        let page = 0;
        let total = 0;
        if (req.query.keyword != undefined && req.query.keyword != '') {
          let keyword = req.query.keyword.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
          condition.contactName = {$regex: '.*' + keyword.trim() + '.*', $options: 'i'};
        }
        if (req.query.leadSrc != undefined && req.query.leadSrc != '' && req.query.leadSrc != '-1') {
          condition.leadSrc = req.query.leadSrc;
        }
        if (req.query.assignedTo != undefined && req.query.assignedTo != '') {
          condition.assignedTo = req.query.assignedTo;
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
        /* Condition area */

        /* Sorting area */
        let sort = {};
        if (req.query.sortBy != undefined && req.query.sortBy != ''
        && req.query.sortValue != undefined && req.query.sortValue != '') {
          sort[req.query.sortBy] = req.query.sortValue;
        }
        /* Sorting area */
        const isAdmin = req.isAdmin;
        if(!isAdmin){
          condition.assignedTo = req.username;
          const contacts = await Contacts.find(condition)
          .sort(sort)
          .limit(limit)
			    .skip(limit * page);
          total = await Contacts.countDocuments(condition);
          if(contacts.length > 0) return apiResponse.successResponseWithData(res, 'Success', {
            contacts: mutipleMongooseToObject(contacts),
            total,
            page,
				    limit
          });
          else return apiResponse.successResponseWithData(res, 'Success', {
            contacts:[],
            total: 0,
            page,
				    limit
          });
        }
        else {
          const contacts = await Contacts.find(condition)
          .sort(sort)
          .limit(limit)
			    .skip(limit * page);
          total = await Contacts.countDocuments(condition);
          if(contacts.length > 0) return apiResponse.successResponseWithData(res, 'Success', {
            contacts: mutipleMongooseToObject(contacts),
            total,
            page,
				    limit
          });
          else return apiResponse.successResponseWithData(res, 'Success', {
            contacts:[],
            total: 0,
            page,
				    limit
          });
        }
      }catch(err){
          return apiResponse.ErrorResponse(res, err);
      }
    }

    // [GET] /contacts/:id - function to get a contact information by contact ID
    getContact(req, res){
        let contactId = req.params.id;
        try{
            Contacts
                .findOne({ _id: contactId })
                .then((contact) => {
                    return apiResponse.successResponseWithData(res, 'Success', { contact: contact });
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [PUT] /contacts/:id - function to update a contact information by contact ID
    updateContact(req, res){
        let contactId = req.params.id;
        let contactInfo = req.body;
        setTimeout(() => {
            try{
                Contacts
                    .updateOne({ _id: contactId }, contactInfo)
                    .then(() => {
                        return apiResponse.successResponse(res, 'Update contact successfully');
                    });
            }catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [DELETE] /contacts/:id - function to delete a contact information by contact ID
    deleteContact(req, res){
        let contactId = req.params.id;
        setTimeout(() => {
            try{
                Contacts
                    .remove({ _id: contactId })
                    .then(() => {
                        return apiResponse.successResponse(res, 'Delete contact successfully');
                    });

            }catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [POST] /delete - function to delete multi contacts information by list of contact ID
    deleteMultiContacts = async (req, res) =>{
      let contactIds = req.body;
      try {
        await Contacts.remove({ _id: { $in : contactIds }})
        return apiResponse.successResponse(res, 'Delete list of contacts successfully');
      } catch(err){
        return apiResponse.ErrorResponse(res, err);
      }
    }

    // [GET] /search/:contactName - function to find contacts by contact name
    findContact(req, res){
        let contactName = req.params.contactName;
        try {
            Contacts
                .find({ contactName : contactName })
                .then((contacts) => {
                    return apiResponse.successResponseWithData(res, 'Success', { contacts: contacts });
                })
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    getLatestContacts = async (req, res) => {
      try {
        const today = new Date();
        const condition = {
          createdTime: { $lte: today - 7 }
        };
        let limit = 5;
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
          let contacts = await Contacts
            .find(condition)
            .limit(limit)
			      .skip(limit * page);
            total = await Contacts.countDocuments(condition);
          return apiResponse.successResponseWithData(res, 'Success', {
            contacts,
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

module.exports = new ContactsController();
