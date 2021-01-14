const express = require('express')
const router = express.Router()

const users = require('./users')
const items = require('./items')
const logs = require('./logs')

router.use('/users', users)
router.use('/items', items)
router.use('/logs', logs)

module.exports = router

