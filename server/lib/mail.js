const nodemailer = require("nodemailer")
require('dotenv').config();

async function sendMail(to, subject, text) {
    console.log("==== process.env.SMTP_HOST: ", process.env.SMTP_HOST)
    console.log("==== process.env.SMTP_PORT: ", process.env.SMTP_PORT)
    console.log("==== process.env.SMTP_USER: ", process.env.SMTP_USER)
    console.log("==== process.env.SMTP_PASS: ", process.env.SMTP_PASS)
    console.log("==== process.env.SMTP_FROM: ", process.env.SMTP_FROM)
    let transporter = nodemailer.createTransport({
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
          console.log("Server is ready to take our messages");
        }
    });

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