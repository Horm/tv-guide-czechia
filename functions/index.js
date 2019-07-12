const functions = require('firebase-functions')

const {
    dialogflow, SimpleResponse, Suggestions
} = require('actions-on-google')

const app = dialogflow()

app.intent('Default Welcome Intent', conv => {
    conv.ask('Welcome to my test app! How can I help you?')
})

app.intent('summary_now', conv => {
    conv.ask('Hi! Ask me to turn the LEDs on or off, tell me the color you want or set the brightness level.');
    conv.ask(new Suggestions(['On', 'Off', 'Blue', 'Red', 'Green', '50%']));
})

app.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't catch that. Can you tell me something else?`)
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)