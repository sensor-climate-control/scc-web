const nodemailer = require("nodemailer")
require('dotenv').config();

let transporter = null

async function connectToSMTP(callback) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        tls: {
            servername: process.env.SMTP_HOST,
            minVersion: "TLSv1.2"
        },
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("SMTP server is ready to take our messages");
        }
    });

    callback()
}
exports.connectToSMTP = connectToSMTP

async function sendMail(to, subject, text) {
    let info = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: to,
        subject: subject,
        text: text
    })
    console.log("==== Message sent: ", info.messageId)
    return info
}
exports.sendMail = sendMail