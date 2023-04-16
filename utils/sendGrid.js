const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendMessageToGmail = async (to, text) => {
    const message = {
        to,
        from: 'pulatov.niyozbek12@gmail.com',
        subject: 'Reset password',
        text: text,
    }

    try {
        await sendGrid.send(message)
    } catch (error) {
        console.error(error)

        if (error.response) {
            console.error(error.response.body)
        }
    }
}

module.exports = sendMessageToGmail
