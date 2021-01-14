const express = require('express')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV == 'development') {
    const dotenv = require('dotenv').config()
}

require('./config/mongoose')

const routes = require('./routes')

const app = express()
const port = process.env.PORT || 5000

router.get('/', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    res.send('cors problem fixed:)');
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(routes)

app.listen(port, () => {
    console.log(`listening on ${port}`)
})
