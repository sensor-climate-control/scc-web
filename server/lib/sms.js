require('dotenv').config()

const textbeltUrl = process.env.TEXTBELT_URL

async function sendSms(to, message) {
    const body = `number=${to}&message=${message}`
    const textbeltHttps = (process.env.TEXTBELT_HTTPS) ? 'https' : 'http'
    const textbeltPort = (process.env.TEXTBELT_PORT) ? `:${process.env.TEXTBELT_PORT}` : ''

    try {
        let textMessage = await fetch(`${textbeltHttps}://${textbeltUrl}${textbeltPort}/text`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        });
        textMessage = await textMessage.json()

        return textMessage
    } catch (e) {
        return({ message: "Fetch was unsuccessful", error: e})
    }
}
exports.sendSms = sendSms