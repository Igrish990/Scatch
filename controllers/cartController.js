const userModel = require('../models/user-model')
module.exports.cartDetail = async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate('cart.product')
    let products = user.cart
    // console.log(user.cart)
    let bill = 0
    let eachBill = []
    let totalBill = 0
    for (let i = 0; i < products.length; i++) {
        bill = (Number(user.cart[i].product.price) + 20) - Number(user.cart[i].product.discount)
        eachBill.push(bill)
    }
    user.cart.forEach(item => {
        totalBill += (item.product.price + 20 - item.product.discount) * item.quantity
    });
    let error = req.flash('error')
    let success = req.flash('success')
    res.render('cart', { user, bill, totalBill, eachBill, error, success })
}
module.exports.addToCart = async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    let productInCart = user.cart.find(item => item.product.toString() === req.params.productid)
    if (productInCart) {
        productInCart.quantity += 1
    } else {
        user.cart.push({ product: req.params.productid, quantity: 1 })
    }
    await user.save()
    req.flash('success', 'Product added to cart')
    res.redirect('/shop')
}
module.exports.increaseQuantity = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email })
        let productInCart = user.cart.find(item => item.product.toString() === req.params.productid)
        if (productInCart) {
            productInCart.quantity += 1
            await user.save()
            req.flash('success', 'Product quantity increased')
        } else {
            req.flash('error', 'Product not found in cart')
        }
        res.redirect('/cart')
    } catch (error) {
        console.error(error)
        req.flash('error', 'Failed to increase product quantity')
        res.redirect('/cart')
    }
}
module.exports.decreaseQuantity = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email })
        let productInCart = user.cart.find(item => item.product.toString() === req.params.productid)
        if (productInCart) {
            if (productInCart.quantity > 1) {
                productInCart.quantity -= 1
                await user.save()
                req.flash('success', 'Product quantity decreased')
            } else {
                user.cart = user.cart.filter(item => item.product.toString() !== req.params.productid)
                await user.save()
                req.flash('error', 'Product removed from cart')
            }
        } else {
            req.flash('error', 'Product not found in cart')
        }
        res.redirect('/cart')
    } catch (error) {
        console.error(error)
        req.flash('error', 'Failed to decrease product quantity')
        res.redirect('/cart')
    }
}