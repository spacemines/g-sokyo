const express = require('express')
const { exec } = require('child_process')

const router = express.Router()

// endpoint logs in a user based on data in body
router.get('/', (req, res) => {
    exec('heroku logs', (error, stdout, stderr) => {
        res.send(stdout)
    })
})

module.exports = router
