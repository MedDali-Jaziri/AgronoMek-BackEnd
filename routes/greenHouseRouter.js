const greenHouseController = require('../controllers/greenHouseController.js')

const routerUser = require('express').Router()

routerUser.post('/matchTheGreenHouseAndUser', greenHouseController.matchTheGreenHouseAndUser)

routerUser.post('/getAllInformationOfSpecficGreenHouse', greenHouseController.getAllInformationOfSpecficGreenHouse)

routerUser.post('/getInformationForHomePage', greenHouseController.getInformationForHomePage)

routerUser.post('/getLatAndLongOfOneUser', greenHouseController.getLatAndLongOfOneUser)

module.exports = routerUser