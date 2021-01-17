const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Item = require('../models/item')

const router = express.Router()
const secret = process.env.SECRET_KEY

// endpoint to create item
router.post('/', async (req, res) => {
    try {
        message = {}
        const token = req.headers.authorization.split(' ')[1]
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        const { username, role } = payload

        // check admin status
        if (role != 'admin') {
            message.message = 'admin role required'
            return res.status(400).json(message)
        }
        
        // check jwt expiration
        if (Date.now() / 1000 > payload.exp) {
            message.message = 'token expired'
            return res.status(400).json(message)
        }

        const { itemname, price, description, category, picture } = req.body
        
        // check required fields
        if (!itemname || !price) {
            message.message = 'required fields are missing'
            return res.status(400).json(message)
        }

        // check if itemname is valid
        const existing_item = await Item.findOne({ itemname })
        if (existing_item) {
            message.message = 'itemname has already been taken'
            res.status(400).json(message)
        }

        // create item
        const item = await Item.create({
            itemname,
            price,
            description,
            category,
            picture
        })

        message.message = 'item created'
        return res.status(200).json(message)
    } catch (err) {
        console.log('error', err)
        res.status(400).end()
    }
})

// endpoint to delete item
router.delete('/:id', async (req, res) => {
    try {
        message = {}
        const token = req.headers.authorization.split(' ')[1]
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        const { username, role } = payload

        // check admin status
        if (role != 'admin') {
            message.message = 'admin role required'
            return res.status(400).json(message)
        }
        
        // check jwt expiration
        if (Date.now() / 1000 > payload.exp) {
            message.message = 'token expired'
            return res.status(400).json(message)
        }

        const item_id = req.params.id
        
        // find item and delete
        const item = await Item.findByIdAndRemove(item_id, req.body)
        if (!item) {
            message.message = 'item id not found'
            return res.status(400).json(message)
        }

        message.message = 'item deleted'
        return res.status(200).json(message)
    } catch (err) {
        console.log('error', err)
        res.status(400).end()
    }
})

// endpoint to get items, default is all items but able to query
router.get('/', async (req, res) => {
    try {
        message = {}
        const token = req.headers.authorization.split(' ')[1]
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        const { username, role } = payload

        // check jwt expiration
        if (Date.now() / 1000 > payload.exp) {
            message.message = 'token expired'
            return res.status(400).json(message)
        }
        
        const query = req.query
        
        const items = await Item.find(query)

        message.message = 'get successful'
        message.items = items
        return res.status(200).json(message)
    } catch (err) {
        console.log('error', err)
        res.status(400).end()
    }
})

module.exports = router
