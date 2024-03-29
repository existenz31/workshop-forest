const express = require('express');
const { PermissionMiddlewareCreator, RecordCreator } = require('forest-express-sequelize');
const router = express.Router();

const models = require('../models');
const collectionName = 'customersSubscriptions';
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${collectionName}`);

const fetch = require('node-fetch');

// Create a Record
router.post(`/${collectionName}`, permissionMiddlewareCreator.create(), (request, response, next) => {
  const recordCreator = new RecordCreator(models[collectionName]);
  recordCreator.deserialize(request.body)
    .then(async (recordToCreate) => {
      recordToCreate.status = 'submitted';
      const plan = await models.products.findByPk(recordToCreate.product);
      recordToCreate.monthlyFees = plan.price;
      return recordCreator.create(recordToCreate)
    })
    .then(record => recordCreator.serialize(record))
    .then(recordSerialized => response.send(recordSerialized))
    .catch(next);
//  next();
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
 * Subscriptions Smart Actions
 */

router.post('/actions/subscriptions/complete', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  const subscriptionId = request.body.data.attributes.ids[0];
  models.customersSubscriptions
  // .findByPk(subscriptionId)
  .findOne({ 
    where: { id: subscriptionId },
    include: { model: models.products, as: 'product' },
  })
  .then ( (customerSubscription) => {
    return customerSubscription.update({ status: 'completed' })
  })
  .then( async (customerSubscriptionUpdated) => {
    const customer = await models.customers.findByPk(customerSubscriptionUpdated.customerIdKey); 
    // Trigger the Zapier Webhook   

    await fetch(process.env.ZAPIER_WORKSHOP_FOREST_WEBHOOK, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        // Pass all customer / subscription details to let the business as free as possible
        customer, 
        subscription: customerSubscriptionUpdated,
      }),
    });

    response.send({ 
      success: 'Subscription Completed!',
     });  
  })
  .catch(next);
});

router.post('/actions/subscriptions/reject', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  const subscriptionId = request.body.data.attributes.ids[0];
  models.customersSubscriptions.update({ 
    status: 'rejected',
    rejectReason:  request.body.data.attributes.values['Rejection Reason'],
  }, {
    where: {
      id: subscriptionId
    }
  })
  .then( () => {
    response.send({ 
      success: 'Subscription Rejected!',
     });  
  })
  .catch(next);
});

String.prototype.format = function() {
  let a = this;
  for (let k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

module.exports = router;
