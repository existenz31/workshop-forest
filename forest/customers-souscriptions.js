const { collection } = require('forest-express-sequelize');

collection('customersSubscriptions', {
  actions: [
    {
      name: 'Complete',
      type: 'single',
      endpoint: '/forest/actions/subscriptions/complete',
    },
    {
      name: 'Reject',
      type: 'single',
      endpoint: '/forest/actions/subscriptions/reject',
      fields: [
        {
          field: 'Rejection Reason',
          type: 'String',
        }
      ],
    },

  ],
  fields: [
    {
      field: 'reference',
      get: (customersSouscriptions) => {
        return `[${customersSouscriptions.product.label}] ${customersSouscriptions.customer.firstname} ${customersSouscriptions.customer.lastname}`;
      }
    }
  ],
  segments: [],
});
