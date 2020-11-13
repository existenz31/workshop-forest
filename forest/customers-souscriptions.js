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
        const productLabel = customersSouscriptions.product.label;
        const firstname = customersSouscriptions.customer.firstname;
        const lastname = customersSouscriptions.customer.lastname;
        
        const customerFullName = (firstname?firstname + ' ': '') + (lastname?lastname: '');
        return `[${productLabel}] ${customerFullName}`;
      }
    }
  ],
  segments: [],
});
