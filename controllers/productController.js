const userModel = require('../models/user-model')
module.exports.purchaseProduct = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate('cart.product')
        if (!Array.isArray(user.orders)) {
            user.orders = []
        }
        if (user.cart.length > 0) {
            user.cart.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    user.orders.push(item.product._id)
                }
            })
            user.cart = []
            await user.save()
            req.flash('success', 'Purchase successful')
        } else {
            req.flash('error', 'Cart is empty')
        }
        res.redirect('/shop')
    } catch (error) {
        console.error(error)
        req.flash('error', 'Purchase failed')
        res.redirect('/cart')
    }
}
module.exports.cancelOrder = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate('orders')
        let orderIndex = user.orders.findIndex(order => order._id.toString() === req.params.orderid.toString())
        if (orderIndex !== -1) {
            user.orders.splice(orderIndex, 1)
            await user.save()
            req.flash('success', 'Order cancelled successfully')
        } else {
            req.flash('error', 'Order not found')
        }
        res.redirect('/account')
    } catch (error) {
        console.error(error)
        req.flash('error', 'Failed to cancel order')
        res.redirect('/account')
    }
}