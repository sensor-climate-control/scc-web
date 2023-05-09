const nodemailer = require("nodemailer")
require('dotenv')

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
            servername: process.env.SMTP_HOST
        },
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

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