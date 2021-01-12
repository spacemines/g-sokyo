const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()

const routes = require('./routes')

require('./config/mongoose')

const app = express()
const port = process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }))

app.use(routes)

app.listen(port, () => {
    console.log(`listening on ${port}`)
})
