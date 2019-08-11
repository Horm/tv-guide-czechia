const functions = require('firebase-functions')
const rp = require('request-promise');
const xmlToJson = require('xml-to-json-stream');
const parser = xmlToJson({attributeMode:false});

const {
    dialogflow, SimpleResponse, Suggestions
} = require('actions-on-google')

const app = dialogflow()

app.intent('Default Welcome Intent', conv => {
    conv.ask('Welcome to my test app! How can I help you?')
    conv.ask(new Suggestions(['What is on TV?']));
})

const channels = [
    {}
]

app.intent('summary_now', conv => {
    const user = "test"
    const date = "13.07.2019"
    const channel = "ct4"
    const url = `https://www.ceskatelevize.cz/services-old/programme/xml/schedule.php?user=${user}&date=${date}&channel=${channel}`;
    return rp(url)
        .then((result) => {
            return parser.xmlToJson(result, (err,json)=>{
                if(err) {
                    //error handling
                }
             
                console.log(json.program.porad[0].nazvy.nazev)
                return conv.ask(`The first program has this title ${json.program.porad[0].nazvy.nazev}`);
            });
            
        })
        .catch((error) => {
            console.log("Error " + error);
            return conv.close("Something went wrong... ");
        });
})

app.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't catch that. Can you tell me something else?`)
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)