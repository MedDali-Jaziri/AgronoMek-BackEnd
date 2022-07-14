const express = require('express')
const cors = require('cors')

const app = express()

var corOptions = {
    origin: 'http://localhost:3030'
}


//  This is the part of our middlware

app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({
    extended: true
}))

// Routers
const routerUser = require('./routes/userRouter.js')
const routerNotification = require('./routes/notificationRouter.js')
app.use('/api/user',routerUser)
app.use('/api/notification',routerNotification)

app.get('/', (req,res) => {
    res.json({
        message: 'Hello Xenophone-IT'
    })
})

// Static image folder
app.use('/Images', express.static('./Images'))

// This is the part of declaration of the port in the part of production
const PORT = process.env.PORT || 3030

// This is the part of running the server
app.listen(
    PORT, ()=> {
        console.log('Server is running on port '+PORT)
    }
)