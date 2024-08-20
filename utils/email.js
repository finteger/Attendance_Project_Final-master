const formData = require('form-data');
const Mailgun = require('mailgun.js');
const { API_KEY, DOMAIN } = require('../config');

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: API_KEY });

// Define the email data
const data = {
    from: 'WebServicesTest@donotreply.com',
    to: 'nashassociatesinc@gmail.com',
    subject: 'Attendance Deficiency (test email)',
    text: 'Hello, Todd Nash. Our records indicate that your attendance is now deficient. Please contact your instructor. This is a test email.',
};

exports.sendEmail = () => {
    mg.messages.create(DOMAIN, data)
        .then(response => {
            console.log('Email sent:', response);
        })
        .catch(error => {
            console.error('Error sending email:', error);
        });
};
