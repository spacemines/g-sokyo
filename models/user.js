const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'restricted'],
        default: 'restricted',
        required: false
    },
    cart: {
        type: Map,
        of: new Schema({
                price: Number,
                description: String,
                category: {
                    type: String,
                    enum: ['book', 'movies', 'music', 'unclassified'],
                    default: 'unclassified'
                },
                picture: String,
                quantity: Number
            }), 
        default: {}
    }
})

module.exports = mongoose.model('User', userSchema)
