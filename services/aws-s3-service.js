var AWS = require("aws-sdk");
const parseDataUri = require("parse-data-uri");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function AwsS3Service() {
  const bucketName = process.env.AWS_BUCKET_NAME;

  let s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  this.getDocumentById = async function (documentId) {
    let url = await s3.getSignedUrl("getObject", {
      Bucket: bucketName,
      Key: documentId,
      Expires: 60 * process.env.AWS_S3_URL_EXPIRE_MINS,
    });

    return url;
  };

  this.uploadFile = async function (filePrefix, fileName, rawData) {
    const parsed = parseDataUri(rawData);
    const fileBase64 = rawData.replace(
      /^data:(image|application)\/\w+;base64,/,
      ""
    );

    // Set up the payload of what we are sending to the S3 api
    //buf = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const key = filePrefix + "/" + fileName + '.' + parsed.mimeType.split('/')[1];
    const s3Params = {
      Bucket: bucketName,
      Key: key,
      Body: Buffer.from(fileBase64, "base64"),
      ContentEncoding: "base64",
      ContentDisposition: "inline",
      ContentType: parsed.mimeType,
      //      ACL: 'private'
    };

    return new Promise((resolve, reject) => {
      s3.putObject(s3Params, (err, data) => {
        if (err) {
          console.log(err);
          reject(new Error("Failed to upload object"));
        }
        // Send it all back
        resolve(key);
      });
    });
  };
}

module.exports = AwsS3Service;
