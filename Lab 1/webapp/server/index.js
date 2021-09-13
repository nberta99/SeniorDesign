const express = require('express')
const path = require('path');
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var tempData = Array(301).fill(null)
var lastAliveTime = null
var waitTime = 10 // wait time in seconds
var maxTemp = 50
var minTemp = 10
var minText = 'Temperature has fallen below minimum threshold'
var maxText = 'Temperature has exceeded the maximum threshold'
var cellNumbers = [null]
var minNotificationTime = null
var maxNotificationTime = null

// Base url and the description of the API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

// Used to press button on box to turn on display
app.get('/press', (req, res) => {
    res.status(200).send('pressed button') // Toggle button on box
})

// Heartbeat of system. Used to have the box let the server know it's alive
app.get('/ping', (req, res) => {
    lastAliveTime = Date.now()
    res.status(200).send('pong') // Send box 'heartbeat'
})

// Returns an array of length 300 of all temperature data point
app.get('/tempData', (req, res) => {
    res.header('Access-Control-Allow-Origin','*');
    res.status(200).send(tempData)
})

// Gets a temperature reading from the box every second. If no reading then inserts null value
setInterval(function() {
    // GET TEMPERATURE DATA FROM BOX (Should be in celcius)
    var temp = Math.floor(Math.random() * 40) + 10;
    if (temp <= minTemp) {
        sendNotification(temp, 'min')
    } else if (temp >= maxTemp) {
        sendNotification(temp, 'max')
    }
    tempData.push(temp) // Adds new temp from box to end of array
    tempData.shift() // Removes first (oldest) element from array
}, 1000);

app.put('/notifications', (req, res) => {
    console.log(req.body)
    maxTemp = req.body.max
    minTemp = req.body.min
    minText = req.body.minText
    maxText = req.body.maxText
    cellNumbers = req.body.cellnums
    res.status(200).send()
})

app.get('/notifications', (req, res) => {
    console.log(sendNotification(-24, 'min'))
    console.log(sendNotification(212, 'max'))
    res.status(200).send(`${minTemp}|${maxTemp}|${minText}|${maxText}|${cellNumbers}`)
})

function sendNotification(temp, bound) {
    var tempVals = `\nCurrent Temp: (${temp}°C/${((temp * (9/5)) + 32).toFixed(1)}°F)`
    if (bound == 'min') {
        if (minNotificationTime + (1000 * waitTime) < Date.now()) {
            minNotificationTime = Date.now()
            return(minText + tempVals + `\nThreshold: (${minTemp}°C/${((minTemp * (9/5)) + 32).toFixed(1)}°F)`)
        } else {
            return(null)
        }
    } else if (bound == 'max') {
        if (maxNotificationTime + (1000 * waitTime) < Date.now()) {
            maxNotificationTime = Date.now()
            return(maxText + tempVals + `\nThreshold: (${maxTemp}°C/${((maxTemp * (9/5)) + 32).toFixed(1)}°F)`)
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