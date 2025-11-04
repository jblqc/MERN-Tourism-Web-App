const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: 'Jennefer Lee <hello@jbl.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Error sending email:', err); // Log the error
        throw err; // Re-throw the error to be caught in the controller
    }
};
module.exports = sendEmail