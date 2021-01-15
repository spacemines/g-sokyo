const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Item = require('../models/item')

const router = express.Router()
const secret = process.env.SECRET_KEY

// endpoint logs in a user based on data in body
router.post('/login', async (req, res) => {
    try {
        message = {}
        const { username, password } = req.body
        
        console.log('request body', req.body)

        // check empty fields
        if (!username || !password) {
            message.message = 'required fields are missing. username and password are required to login.'
            console.log(message)
            return res.status(400).json(message)
        }
        
        // get user from database
        const user = await User.findOne({ username })
        if (!user) {
            message.message = 'user not found'
            console.log(message)
            return res.status(400).json(message)
        }
        const role = user.role
        
        // check password
        const match = await bcrypt.compareSync(password, user.password)
        if (!match) {
            message.message = 'incorrect password'
            console.log(message)
            return res.status(400).json(message)
        }

        // create token
        message.token = jwt.sign({ username, role }, secret, { expiresIn: '1d' })
        message.message = 'login succeeded'
        message.user = user
        res.status(200).json(message)
        
    } catch (err) {
        console.log('error', err)
        res.status(400).end()
    }
})

// endpoint creates a user based on data in body
router.post('/signup', async (req, res) => {
    try {
        message = {}
        const { username, email, password } = req.body
        
        // console log the payload
        console.log('request body', req.body)

        // check empty fields
        if (!username || !email || !password) {
            message.message = 'required fields are missing. username, email, and password are required to sign up.'
            res.status(400).json(message)
        }
        
        // check if username is valid
        const existing_user = await User.findOne({ username })
        if (existing_user) {
            message.message = 'username has already been taken'
            res.status(400).json(message)
        }
        
        // hash password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        
        // create new user
        const user = await User.create({
            username,
            email,
            password: hash
        })

        message.message = 'sign up succeeded'
        return res.status(200).json(message) 
    } catch (err) {
        console.log('error', err)
        res.status(400).end()
    }
})

router.post('/cart-items', async (req, res) => {
    try {
        message = {}
        const token = req.headers.authorization.split(' ')[1]
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        const { username, role } = payload

        // console log payload and request body
        console.log('payload', payload)
        console.log('request body', req.body)

        // check jwt expiration
        if (Date.now() / 1000 > payload.exp) {
            message.message = 'token expired'
            return res.status(400).json(message)
        }

        // make sure user exists
        const user = await User.findOne({ username })
        if (!user) {
            message.message = 'user not found'
            return res.status(400).json(message)
        }

        // process item and quantity
        const { itemname, quantity } = req.body
        
        // make sure item exists
        const item = await Item.findOne({ itemname })
        if (!item) {
            message.message = 'item not found'
            return res.status(400).json(message)
        }
        let cartItem = { ...item._doc, 'quantity': quantity }
        // add it to user's cart
        user.cart.set(itemname, cartItem) 
        user.save()
        message.message = 'item added'
        message.user = user
        return res.status(200).json(message)
    } catch (err) {
        console.log('error', err)
        res.status(400).end()
    }
})

router.get('/cart-items', async (req, res) => {
    try {
        message = {}
        const token = req.headers.authorization.split(' ')[1]
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        const { username, role } = payload

        // console log payload and request body
        console.log('payload', payload)
        console.log('request body', req.body)

        // check jwt expiration
        if (Date.now() / 1000 > payload.exp) {
            message.message = 'token expired'
            return res.status(400).json(message)
        }

        // make sure user exists
        const user = await User.findOne({ username })
        if (!user) {
            message.message = 'user not found'
            return res.status(400).json(message)
        }

        // show user cart
        message.message = 'get successful'
        message.cart = user.cart
        return res.status(200).json(message)
    } catch (err) {
        console.log('error', err)
        res.status(400).end()
    }
})

router.get('/cart-items/checkout', async (req, res) => {
    try {
        message = {}
        const token = req.headers.authorization.split(' ')[1]
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        const { username, role } = payload

        // console log payload and request body
        console.log('payload', payload)
        console.log('request body', req.body)

        // check jwt expiration 
        if (Date.now() / 1000 > payload.exp) {
            message.message = 'token expired'
            return res.status(400).json(message)
        }

        // make sure user exists
        const user = await User.findOne({ username })
        if (!user) {
            message.message = 'user not found'
            return res.status(400).json(message)
        }

        // reset user cart
        user.cart = {}
        user.save()
        message.message = 'checkout success'
        message.user = user
        return res.status(200).json(message)
    } catch (err) {
        console.log('error', err)
        res.status(400).end()
    }
})

module.exports = router
