// This model was generated by Lumber. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const CustomersSubscriptions = sequelize.define('customersSubscriptions', {
    status: {
      type: DataTypes.STRING,
    },
    rejectReason: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    monthlyFees: {
      type: DataTypes.DECIMAL,
    },
    iban: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'customers_subscriptions',
    underscored: true,
    timestamps: true,
    schema: process.env.DATABASE_SCHEMA,
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  CustomersSubscriptions.associate = (models) => {
    CustomersSubscriptions.belongsTo(models.customers, {
      foreignKey: {
        name: 'customerIdKey',
        field: 'customer_id',
      },
      as: 'customer',
    });

    CustomersSubscriptions.belongsTo(models.products, {
      foreignKey: {
        name: 'productIdKey',
        field: 'product_id',
      },
      as: 'product',
    });
  };

  return CustomersSubscriptions;
};
