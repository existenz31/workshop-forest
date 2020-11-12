module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  const SubscriptionProducts = sequelize.define('subscriptionProducts', {
    // Filter on isSubscription = true configured as a Scope in the subscriptionProducts collection
    label: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL,
    },
    isRecurrent: {
      type: DataTypes.BOOLEAN,
    },
    isSubscription: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    // defaultScope: {
    //   where: {
    //     isSubscription: true
    //   }
    // },
    tableName: 'products_fintech',
    underscored: true,
    timestamps: true,
    schema: process.env.DATABASE_SCHEMA,
  });

  SubscriptionProducts.associate = (models) => {
  };

  return SubscriptionProducts;
};
