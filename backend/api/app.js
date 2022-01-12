require('dotenv').config()

const express = require('express')

const indexRouter = require('./routes/index')
const githubAddUserRouter = require('./routes/github')

const app = express()

app.use('/', indexRouter)
app.use('/github', githubAddUserRouter)

module.exports = app
