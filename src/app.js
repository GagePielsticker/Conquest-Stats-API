// Dependencies
const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const client = {
  settings: require('./settings/settings.json')
}

// Import custom libraries
require('./lib/database.js')(client)
require('./lib/statistics.js')(client)

// engine setup and database connect
const app = express()
client.connectDb()

// middleware setup
app.use(logger('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// routers requiring user
app.use('/api/discord', require('./routes/discord.js')(client))

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)))

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.status(err.status)
  res.send('error')
})

module.exports = app
