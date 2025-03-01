const express = require('express')
const app = express()


const indexRouter = require('./routes/index')
const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')

const expressSession = require('express-session')
const flash = require('connect-flash')

require('dotenv').config()

const db = require('./config/mongoose-connection')

const cookieParser = require('cookie-parser')
const path = require('path')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
    expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)
app.use(flash())



app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')


app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/', indexRouter)

app.listen(2000, (req, res) => {
    console.log('Server is running on port http://localhost:2000')
})