const { collection } = require('forest-express-sequelize');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
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
  },
  {
    name: 'Subscribe Comprehensive Plan',
    type: 'single',
    endpoint: '/forest/actions/front/subscribe-comprehensive-plan',
  },
  {
    name: 'Subscribe Premium Plan',
    type: 'single',
    endpoint: '/forest/actions/front/subscribe-premium-plan',
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
      return `${customer.firstname} ${customer.lastname}`;
    }
  }, 
  {
    field: 'locationGeo',
    get: (customer) => {
      return [12, 41];
    }

  }],
  segments: [],
});
