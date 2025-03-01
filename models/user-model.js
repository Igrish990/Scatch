const mongoose = require('mongoose')
const { type } = require('os')
const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    }],
    contact: Number,
    picture: String,

})
module.exports = mongoose.model('user', userSchema)