const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const twilio = require('twilio');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Find your account sid and auth token in your Twilio account Console.
var client = new twilio('AC2f4ca5e7892131849ce0aae6e4f51326', '42df125b62e1d8eaec6c15ea2fc6885c');
var tempDataCelcius = Array(301).fill(null)
var tempDataFarenheit = Array(301).fill(null)
var lastAliveTime = null
var waitTime = 30 // wait time in seconds
var maxTemp = 50
var minTemp = 10
var minText = 'Temperature has fallen below minimum threshold'
var maxText = 'Temperature has exceeded the maximum threshold'
var cellNumbers = "8158427363"
var minNotificationTime = null
var maxNotificationTime = null
var buttonPress = false
var probe = false
var connected = false
var promptMessage = "Unit not connected"
var addedMsg = ''
var twilioNumber = "+13192148850"

function notConected() {
    addTempData('null')
    connected = false
    promptMessage = "Unit not connected"
}

var timer = setInterval(notConected, 2000);

// // Base url and the description of the API
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/index.html'))
// })

// Used to press button on box to turn on display
app.get('/press', (req, res) => {
    buttonPress = true
    res.status(200).send('pressed button') // Toggle button on box
    // setTimeout(buttonClick, 10000)
})

// Heartbeat of system. Used to have the box let the server know it's alive
app.get('/ping', (req, res) => {
    clearInterval(timer);
    // console.log(req.query)
    lastAliveTime = Date.now()
    connected = true
    probe = req.query.probe
    if (probe == "false") {
        promptMessage = 'Probe not connected'
    }
    addTempData(req.query.temp)
    if(buttonPress) {
        res.status(200).send('pong,pressed') // Send box 'heartbeat'
        buttonPress = false
    } else {
        res.status(200).send('pong') // Send box 'heartbeat'
    }
    timer = setInterval(notConected, 2000);
})

app.get('/currTemp', (req, res) => {
    res.header('Access-Control-Allow-Origin','*')
    if (req.query['unit'] == 'F') {
        if (probe == 'false' || connected == false) {
            res.status(200).send(promptMessage)
        } else {
            res.status(200).send(`${tempDataFarenheit[300]}°F`)
        }
    } else {
        if (probe == 'false' || connected == false) {
            res.status(200).send(promptMessage)
        } else {
            res.status(200).send(`${tempDataCelcius[300]}°C`)
        }
    }
})

// Returns an array of length 300 of all temperature data point
app.get('/tempData', (req, res) => {
    res.header('Access-Control-Allow-Origin','*')
    if (req.query['unit'] == 'F') {
        res.status(200).send(tempDataFarenheit)
    } else {
        res.status(200).send(tempDataCelcius)
    }
})

// Gets a temperature reading from the box every second. If no reading then inserts null value
function addTempData(temp) {
    // GET TEMPERATURE DATA FROM BOX (Should be in celcius)
    if (temp != 'null') {
        temp = parseFloat(temp)
        if (temp < minTemp) {
            sendNotification(temp, 'min')
        } else if (temp > maxTemp) {
            sendNotification(temp, 'max')
        }
        tempDataCelcius.push(temp) // Adds new temp from box to end of array
        tempDataFarenheit.push(((temp * (9/5)) + 32).toFixed(1))
    } else {
        tempDataCelcius.push(null)
        tempDataFarenheit.push(null)
    }
    tempDataCelcius.shift() // Removes first (oldest) element from array
    tempDataFarenheit.shift() // Removes first (oldest) element from array
}

app.post('/notifications', (req, res) => {
    res.header('Access-Control-Allow-Origin','*')
    maxTemp = req.body.maxTemp
    minTemp = req.body.minTemp
    minText = req.body.minText
    maxText = req.body.maxText
    cellNumbers = `${req.body.cell}`
    res.status(200).send()
})

app.get('/notifications', (req, res) => {
    res.header('Access-Control-Allow-Origin','*')
    res.status(200).json({minTemp:minTemp, minText:minText, maxTemp:maxTemp, maxText:maxText, cell:cellNumbers})
})

function sendNotification(temp, bound) {
    var tempVals = `\nCurrent Temp: (${temp}°C/${((temp * (9/5)) + 32).toFixed(1)}°F)`
    if (bound == 'min') {
        if (minNotificationTime + (1000 * waitTime) < Date.now()) {
            minNotificationTime = Date.now()
            // Send the text message.
            client.messages.create({
                to: `+1${cellNumbers}`,
                from: `${twilioNumber}`,
                body: `${minText} ${tempVals}\nThreshold: (${minTemp}°C/${((minTemp * (9/5)) + 32).toFixed(1)}°F)`
            });
            return("Cold notification")
        } else {
            return(null)
        }
    } else if (bound == 'max') {
        if (maxNotificationTime + (1000 * waitTime) < Date.now()) {
            maxNotificationTime = Date.now()
            // Send the text message.
            client.messages.create({
                to: `+1${cellNumbers}`,
                from: `${twilioNumber}`,
                body: `${maxText} ${tempVals}\nThreshold: (${maxTemp}°C/${((maxTemp * (9/5)) + 32).toFixed(1)}°F)`
            });
            return("Hot notification")
        } else {
            return(null)
        }
    } else {
        return(null)
    }
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})