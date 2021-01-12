const express = require('express')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV == 'development') {
    const dotenv = require('dotenv').config()
}

const routes = require('./routes')

require('./config/mongoose')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: true }))

app.use(routes)

app.listen(port, () => {
    console.log(`listening on ${port}`)
})
