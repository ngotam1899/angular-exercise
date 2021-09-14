const mg = require('mongoose');

const Schema = mg.Schema;

const SalesOrder = new Schema({
    subject: { type: String, required: true },
    contactName : { type: String, ref: 'Contact', required: true },
    status: { type: String, required: true },
    // (0) Created, (1) Approved, (2) Delivered, (3) Cancelled
    total: { type: Number, required: true },
    assignedTo: { type: String, ref: 'User', required: true },
    creator: { type: String, ref: 'User', required: true },
    description: { type: String, required: false },
    createdTime: { type: Date, default: new Date() },
    updatedTime: { type: Date, default: new Date() },
});

module.exports = mg.model('SalesOrder', SalesOrder);
