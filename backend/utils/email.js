const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(" ")[0];
    this.url = url;
    this.from = `Jennefer Lee <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_USERNAME,
          pass: process.env.BREVO_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject, extraData = {}) {
    const path = require("path");

    // ⭐ FIX: spread extraData so pug gets "code", not "extraData.code"
    const html = pug.renderFile(
      path.join(__dirname, `../views/emails/${template}.pug`),
      {
        firstname: this.firstname,
        url: this.url,
        subject,
        ...extraData, // <--- FIX HERE
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html, { wordwrap: 130 }),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset link (valid for only 10 minutes)"
    );
  }

  async sendLoginCode(code) {
    await this.send("loginCode", "Your Login Code", { code });
  }
};
