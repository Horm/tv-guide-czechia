import moment from "moment";

function getChannelFullGuide(channelName) {
    const user = "test"
    const date = formatDateForCzechTV(new Date())
    const url = `https://www.ceskatelevize.cz/services-old/programme/xml/schedule.php?user=${user}&date=${date}&channel=${channelName}`;
    return rp(url)
        .then((result) => {
            return parser.xmlToJson(result, (err,json)=>{
                if(err) {
                    //error handling
                }
                return json.program
            });
            
        })
}

function getChannelCurrentShow(channelName) {
    
}

export function formatDateForCzechTV(date) {
    return moment(date).format("DD.MM.YYYY")
}