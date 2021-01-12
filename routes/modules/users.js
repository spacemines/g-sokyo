const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../../models/user')
const secret = process.env.SECRET_KEY

// endpoint logs in a user based on data in body
router.post('/login', async (req, res) => {
    try {
        message = {}
        const { username, password } = req.body

        // check empty fields
        if (!username || !password) {
            message.message = 'required fields are missing'
            return res.status(400).json(message)
        }
        
        // get user from database
        const user = await User.findOne({ username })
        if (!user) {
            message.message = 'user not found'
            return res.status(400).json(message)
        }
        const role = user.role
        
        // check password
        const match = await bcrypt.compareSync(password, user.password)
        if (!match) {
            message.message = 'incorrect password'
            return res.status(400).json(message)
        }

        // create token
        message.token = jwt.sign({ username, role }, secret, { expiresIn: '1d' })
        message.mesage = 'login succeeded'
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
        const { username, email, password, confirm_password } = req.body
        
        // console log the payload
        console.log(req.body)

        // check empty fields
        if (!username || !email || !password || !confirm_password) {
            message.message = 'required fields are missing'
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

        message.token = jwt.sign({ username }, secret, { expiresIn: '1d' })
        message.message = 'sign up succeeded'
        return res.status(200).json(message) 
    } catch (err) {
        console.log('error', err)
        res.status(400).end()
    }
})

module.exports = router
