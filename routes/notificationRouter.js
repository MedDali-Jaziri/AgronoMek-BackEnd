const notificationController = require('../controllers/notificationController.js')

const routerNotification = require('express').Router()

routerNotification.post('/addNotification', notificationController.addNotification)

routerNotification.post('/sendVerificationLink', notificationController.sendVerificationLink)

routerNotification.get('/activationLink/:email', notificationController.activationLink)

module.exports = routerNotification