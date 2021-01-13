const express = require('express')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV == 'development') {
    const dotenv = require('dotenv').config()
}

require('./config/mongoose')

const routes = require('./routes')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(routes)

app.listen(port, () => {
    console.log(`listening on ${port}`)
})
