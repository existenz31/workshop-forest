const { collection } = require('forest-express-sequelize');
const moment = require('moment');

const subscriptionFormFields = [
  {
    field: 'Start Date',
    type: 'Dateonly',
    required: true,
  },
  {
    field: 'Bank Account Details',
    description: 'IBAN or SEPA',
    type: 'String',
    required: true,
  },
];

collection('customers', {
  actions: [
  {
    name: 'Change Avatar',
    type: 'single',
  }, 
  {
    name: 'Approve',
    type: 'single',
    endpoint: '/forest/actions/customers/approve',
  },
  {
    name: 'Reject',
    type: 'single',
    endpoint: '/forest/actions/customers/reject',
    fields: [
      {
        field: 'Rejection Reason',
        type: 'String',
      }
    ],
  },
  {
    name: 'Subscribe Basic Plan',
    type: 'single',
    endpoint: '/forest/actions/front/subscribe-basic-plan',
    fields: subscriptionFormFields,
    values: () => { return {'Start Date': moment().format('YYYY-MM-DD')} },
  },
  {
    name: 'Subscribe Comprehensive Plan',
    type: 'single',
    endpoint: '/forest/actions/front/subscribe-comprehensive-plan',
    fields: subscriptionFormFields,
    values: () => { return {'Start Date': moment().format('YYYY-MM-DD')} },
  },
  {
    name: 'Subscribe Premium Plan',
    type: 'single',
    endpoint: '/forest/actions/front/subscribe-premium-plan',
    fields: subscriptionFormFields,
    values: () => { return {'Start Date': moment().format('YYYY-MM-DD')} },
  },
  {
    name: 'KYC',
    type: 'global',
    endpoint: '/forest/actions/front/kyc',
    fields: [
    {
      field: 'Full Name',
      type: 'String',
      isRequired: true
    },
    {
      field: 'Email',
      type: 'String',
      isRequired: true
    },
    {
      field: 'Phone',
      description: 'International Format: e.g. +33612345678',
      type: 'String',
      isRequired: true
    },
    {
      field: 'ID Document',
      description: 'Provide a valid document ID: Passport, ID Card, Driving Licence',
      type: 'File',
      isRequired: true
    },
    ]
  }, 
  ],
  fields: [{
    field: 'fullName',
    get: (customer) => {
      const firstname = customer.firstname;
      const lastname = customer.lastname;      
      const customerFullName = (firstname?firstname + ' ': '') + (lastname?lastname: '');

      return `${customerFullName}`;
    }
  }],
  segments: [],
});
