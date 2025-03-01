const express = require('express')
const router = express.Router()
const isLoggedin = require('../middlewares/isLoggedin')
const productModel = require('../models/product-model')
const userModel = require('../models/user-model')
const { cartDetail, addToCart, increaseQuantity, decreaseQuantity } = require('../controllers/cartController')
const { purchaseProduct, cancelOrder } = require('../controllers/productController')
// const flash = require('connect-flash')

router.get('/', (req, res) => {
    let error = req.flash('error')
    let success = req.flash('success')
    // console.log(error)
    res.render('index', { error, success, loggedin: false })
})

router.get('/shop', isLoggedin, async (req, res) => {
    let error = req.flash('error')
    let success = req.flash('success')
    let products = await productModel.find()
    res.render('shop', { error, success, products })
})
router.get('/cart', isLoggedin, cartDetail)


router.get('/addtocart/:productid', isLoggedin, addToCart)

router.post('/cart/increase/:productid', isLoggedin, increaseQuantity)

router.post('/cart/decrease/:productid', isLoggedin, decreaseQuantity)
router.post('/purchase', isLoggedin, purchaseProduct)

router.post('/cancelorder/:orderid', isLoggedin, cancelOrder)
router.get('/account', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate('orders')
    let error = req.flash('error')
    let success = req.flash('success')
    res.render('account', { user, error, success })
})

router.get('/logout', isLoggedin, async (req, res) => {
    res.render('shop')
})

module.exports = router