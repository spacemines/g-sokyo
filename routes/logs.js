const express = require('express')
const { exec } = require('child_process')

const router = express.Router()

// endpoint sends back heroku logs
router.get('/', (req, res) => {
    exec('heroku logs', (error, stdout, stderr) => {
        console.log('stdout', stdout)
        res.send(stdout)
    })
})

module.exports = router
