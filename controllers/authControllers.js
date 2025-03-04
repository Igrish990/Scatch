const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const { generateToken } = require('../utils/generateToken')
module.exports.registerUser = async (req, res) => {

    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email: email })
        if (user) {
            req.flash('error', 'You have a account ,please login')
            return res.redirect('/')
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.send(err.message)
                else {
                    let user = await userModel.create({
                        email, password: hash, fullname
                    })
                    let token = generateToken(user)
                    res.cookie('token', token)
                    req.flash('success', 'Account created Successfully')
                    res.redirect('/')
                    // res.send(createdUser)
                }
            })
        })



    } catch (error) {
        res.send(error.message)
    }

}

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email: email })
    if (!user) {
        req.flash('error', "Email or Password incorrect")
        return res.redirect('/')
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = generateToken(user)
            res.cookie('token', token)
            req.flash('success', 'Welcome to the Shopping application')
            res.redirect('/shop')
        }
        else {
            req.flash('error', "Email or Password incorrect")
            return res.redirect('/')
        }
    })
}
module.exports.logout = (req, res) => {
    res.cookie('token', '') 
    req.flash('error', 'You are Logged Out ')
    res.redirect('/')
}