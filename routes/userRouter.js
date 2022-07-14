const userController = require('../controllers/userController.js')

const routerUser = require('express').Router()

routerUser.post('/addUser', userController.upload, userController.addUser)

routerUser.get('/getAllUser', userController.getAllUser)

routerUser.get('/getAllUserByEmAndNa', userController.getAllUserByEmAndNa)

routerUser.post('/loginUser', userController.loginUser)

routerUser.post('/getAllNotificationOfSpecificationUser', userController.getAllNotificationOfSpecificationUser)

routerUser.post('/forgetPassword', userController.forgetPassword)

routerUser.post('/testThepasswordUpdate', userController.testThepasswordUpdate)

module.exports = routerUser