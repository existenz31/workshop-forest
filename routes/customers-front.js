const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const models = require('../models');
const AwsS3Service = require('../services/aws-s3-service');
const s3Service = new AwsS3Service();

const collectionName = 'customers';
const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${collectionName}`);

async function createSubscription(opts, subscriptionLabel) {
  const plan = await models.subscriptionProducts.findOne({where: {label: subscriptionLabel}});


  const documentPrefix = `customers/${opts.customerId}`;
  const key = await s3Service.uploadFile(documentPrefix, 'subscription-sof', opts.sourceFundsFile);

  const doc = await models.documents.create({
    s3Id: key,
    isVerified: false,
    type: 'source_of_funds',
  });

  // eslint-disable-next-line no-unused-vars
  const customerDocument = await models.customersDocuments.create({
    documentId: doc.id,
    customerId: opts.customerId,
  });

  return models.customersSubscriptions.create({
    status: 'submitted',
    startDate: opts.startDate,
    iban: opts.iban,
    productIdKey: plan.id,
    customerIdKey: opts.customerId,
    monthlyFees: plan.price,
  });
}

router.post('/actions/front/subscribe-basic-plan', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  const opts = {
    customerId: request.body.data.attributes.ids[0],
    startDate: request.body.data.attributes.values['Start Date'],
    iban: request.body.data.attributes.values['Bank Account Details'],
    sourceFundsFile: request.body.data.attributes.values['Source of Funds'],
  };
  createSubscription(opts, 'Basic plan')
  .then( () => {
    response.send({ 
      success: 'Basic Subscription submitted!',
      refresh: { relationships: ['subscriptions', 'documents'] },
     });  
  })
  .catch(next);
});

router.post('/actions/front/subscribe-comprehensive-plan', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  const opts = {
    customerId: request.body.data.attributes.ids[0],
    startDate: request.body.data.attributes.values['Start Date'],
    iban: request.body.data.attributes.values['Bank Account Details'],
    sourceFundsFile: request.body.data.attributes.values['Source of Funds'],
  };
  createSubscription(opts, 'Comprehensive plan')
  .then( () => {
    response.send({ 
      success: 'Comprehensive Subscription submitted!',
      refresh: { relationships: ['subscriptions', 'documents'] },
     });  
  })
  .catch(next);
});

router.post('/actions/front/subscribe-premium-plan', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  const opts = {
    customerId: request.body.data.attributes.ids[0],
    startDate: request.body.data.attributes.values['Start Date'],
    iban: request.body.data.attributes.values['Bank Account Details'],
    sourceFundsFile: request.body.data.attributes.values['Source of Funds'],
  };
  createSubscription(opts, 'Premium plan')
  .then( () => {
    response.send({ 
      success: 'Premium Subscription submitted!',
      refresh: { relationships: ['subscriptions', 'documents'] },
     });  
  })
  .catch(next);
});

router.post('/actions/front/kyc', permissionMiddlewareCreator.smartAction(), async (request, response, next) => {
  const formValues = request.body.data.attributes.values;
  const fullName = formValues['Full Name'];
  const email = formValues['Email'];
  const phone = formValues['Phone'];
  const file = formValues['ID Document'];
  const avatar = `https://robohash.org/${email}`;
  
  models.customers.create({
    firstname: fullName.split(' ')[0],
    lastname: fullName.split(' ')[1],
    email,
    phone,
    avatar,
    status: 'signed_up',
  })
  .then(async (customerCreated) => {
    // ToDo: Create Document
    const documentPrefix = `customers/${customerCreated.id}`;
    const key = await s3Service.uploadFile(documentPrefix, 'kyc-id-document', file);

    const doc = await models.documents.create({
      s3Id: key,
      isVerified: false,
      type: 'id_document',
    });

    // eslint-disable-next-line no-unused-vars
    const customerDocument = await models.customersDocuments.create({
      documentId: doc.id,
      customerId: customerCreated.id,
    });
    return customerCreated;
  })
  .then( (customerCreated) => {
    response.send({ 
      success: `Welcome ${formValues['Full Name']}!`,
      // ToDo: Redirect to user
      redirectTo: `/workshop-forest/${process.env.ENV_NAME}/${request.user.team}/data/customers/index/record/customers/${customerCreated.id}/summary`,
     });  
  })
  .catch(next);
});
module.exports = router;
