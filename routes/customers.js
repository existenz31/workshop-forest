const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const router = express.Router();

const models = require('../models');
const collectionName = 'customers';
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${collectionName}`);

const EmailService = require("../services/email-service");

// Create a Record
router.post(`/${collectionName}`, permissionMiddlewareCreator.create(), (request, response, next) => {
 next();
});

// Update a Record
router.put(`/${collectionName}/:recordId`, permissionMiddlewareCreator.update(), (request, response, next) => {
  next();
});

// Delete a Record
router.delete(`/${collectionName}/:recordId`, permissionMiddlewareCreator.delete(), (request, response, next) => {
  next();
});

// Get a list of Records
router.get(`/${collectionName}`, permissionMiddlewareCreator.list(), async (request, response, next) => {
  next();
});

// Get a number of Records
router.get(`/${collectionName}/count`, permissionMiddlewareCreator.list(), (request, response, next) => {
  next();
});

// Get a Record
router.get(`/${collectionName}/:recordId`, permissionMiddlewareCreator.details(), (request, response, next) => {
  next();
});

// Export a list of Records
router.get(`/${collectionName}.csv`, permissionMiddlewareCreator.export(), (request, response, next) => {
  next();
});

// Delete a list of Records
router.delete(`/${collectionName}`, permissionMiddlewareCreator.delete(), (request, response, next) => {
  next();
});

/** 
 * Customers Smart Actions
 */
router.post('/actions/customers/approve', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  const customerId = request.body.data.attributes.ids[0];

  models.customers.findByPk(customerId)
  .then( (customer) => {
    return customer.update({ 
      status: 'approved' 
    });
  })
  .then( (customer) => {
    /* Send Welcome email to the approved customer */
    let emailService = new EmailService();
    let firstname = customer.firstname?customer.firstname:'';
    let lastname = customer.lastname?customer.lastname:'';
    
    return emailService.sendEmail(
      customer.email,
      process.env.SENDGRID_TEMPLATE_WELCOME,
      {
        fullName: `${firstname} ${lastname}`,
      }
    );
  })
  .then( () => {
    response.send({ 
      success: 'Customer Approved!',
     });  
  })
  .catch(next);

});

router.post('/actions/customers/reject', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  const customerId = request.body.data.attributes.ids[0];
  models.customers.findByPk(customerId)
  .then( (customer) => {
    return customer.update({ 
      status: 'rejected',
      rejectReason:  request.body.data.attributes.values['Rejection Reason'],
      });
  })
  // eslint-disable-next-line no-unused-vars
  .then( (customer) => {
    response.send({ 
      success: 'Customer Rejected!',
     });  
  })
  .catch(next);
});

module.exports = router;
