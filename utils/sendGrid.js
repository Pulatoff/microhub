const sendGrid = require('@sendgrid/mail')
// sendGrid.setApiKey = ''

sendGrid.setApiKey('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')

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
