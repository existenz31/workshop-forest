const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const SENDGRID_SENDER = process.env.SENDGRID_SENDER;

function EmailService() {
  this.sendEmail = async function (to, templateId, dynamicTemplateData) {
    // Send the transactionnal email
    const msg = {
      to: to,
      from: SENDGRID_SENDER,
      templateId: templateId,
      dynamic_template_data: dynamicTemplateData,
    };
    return sgMail.send(msg);
  };
}

module.exports = EmailService;
