const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/ContactsController');
const authController = require('../controllers/AuthController');
const jwtHelper = require('../config/jwtHelper');

router.post('/', contactsController.storeContact); // store a contact
router.get('/', jwtHelper.verifyJwtToken, authController.verifyUser, contactsController.getListOfContacts); // get list of contacts
router.get('/revenue', jwtHelper.verifyJwtToken, authController.verifyUser, contactsController.revenueContacts); // revenue contacts
router.get('/latest', jwtHelper.verifyJwtToken, authController.verifyUser, contactsController.getLatestContacts); // new contact in the last 7 days
router.get('/:id', contactsController.getContact); // get a contact by contact ID
router.put('/:id', contactsController.updateContact); // update a contact by contact ID
router.post('/delete', contactsController.deleteMultiContacts); // delete multi contacts
router.delete('/:id', contactsController.deleteContact); // delete a contact by contact ID
router.get('/search/:contactName', contactsController.findContact); // find a contact by contact name

module.exports = router;
