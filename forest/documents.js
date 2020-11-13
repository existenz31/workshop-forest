const { collection } = require('forest-express-sequelize');
const AwsS3Service = require('../services/aws-s3-service');
const s3Service = new AwsS3Service();

collection('documents', {
  actions: [],
  fields: [
    {
      field: 'file',
      type: 'String',
      get: (document) => {
        return s3Service.getDocumentById(document.s3Id);
      }
    }
  ],
  segments: [],
});
