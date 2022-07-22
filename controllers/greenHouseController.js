const db = require('../models')
const jwt = require('jsonwebtoken');


// Create main Model
const User = db.users
const Notification = db.notifications

// Call another controllers
const notificationController = require('./notificationController.js');

// Connect to the firebase
const admin = require("firebase-admin");
var serviceAccount = require("./agronomek-3c1e6-firebase-adminsdk-smlk4-fb7d1b8fae.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://agronomek-3c1e6-default-rtdb.firebaseio.com"
});
  

// This function allow you to decode an string to json datatype
function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

// 1. Match an specific greenhouse with a specific user
const matchTheGreenHouseAndUser = async (req, res) => {
    try{
        let info = {
            tokenId: req.body.tokenId,
            payload: req.body.payload,
        }
    
        if(!info.tokenId || !info.payload){
            res.status(422).send({
                error: "Please add all the fields"
            })
        }
        var email = parseJwt(info.tokenId).email;
        var idGreenHouse = parseJwt(info.payload).Id_AgronoMek;

        var user = await User.findOne({
            where: {
                email: email,
            }
        })
        if(!user.email){
            res.status(404).send({
                message: "Your Greenhouse is already matching :( :( !!"
            })
        }

        console.log(idGreenHouse);
        console.log(user.id);

        var dbFireBase = admin.database();
        dbFireBase.ref('AgronoMekDB/'+ idGreenHouse + '/User_Id').set(user.id)
        user.connectedToGreenHouse = true;
        // user.idGreenHouse = idGreenHouse
        await user.save();

        res.status(200).send({
            Result_Matching: "We just match the greenhouse "+idGreenHouse+" with the user "+user.userName
        })
        

        // var oneGreenHouse = agronoMek.child(idGreenHouse)

        // oneGreenHouse.once('value', function(snap){
        //    res.status(200).send({
        //     resultOfGreenHouse: snap.val()
        // })
        // });
        
        // console.log("This is the result of Agronomek table");
        // console.log(dbRef);


        // res.status(200).send({
        //     Token: parseJwt(info.tokenId),
        //     QrCode: parseJwt(info.payload)
        // })


    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}


// 2. Get All the Information Of an Specfic GreenHouse
const getAllInformationOfSpecficGreenHouse = async (req, res) => {
    try{
        let info = {
            tokenId: req.body.tokenId,
            payload: req.body.payload,
        }
    
        if(!info.tokenId || !info.payload){
            res.status(422).send({
                error: "Please add all the fields"
            })
        }
        var email = parseJwt(info.tokenId).email;
        var idGreenHouse = parseJwt(info.payload).Id_AgronoMek;

        var user = await User.findOne({
            where: {
                email: email,
            }
        })
        if(!user.email){
            res.status(404).send({
                message: "Check your email :( :( !!"
            })
        }

        console.log(idGreenHouse);
        console.log(user.id);

        var dbFireBase = admin.database();
        var oneGreenHouse = dbFireBase.ref('AgronoMekDB/'+ idGreenHouse + '/')

        oneGreenHouse.once('value', function(snap){
           res.status(200).send({
            resultOfGreenHouse: snap.val()
        })
        });

    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}

// 2. Get some specific information for home page (Name_GreenHouse, Temperature value (last one), Humidity value (last one))
const getInformationForHomePage = async (req, res) => {
    try{
        let info = {
            tokenId: req.body.tokenId,
            payload: req.body.payload,
        }
    
        if(!info.tokenId || !info.payload){
            res.status(422).send({
                error: "Please add all the fields"
            })
        }
        var email = parseJwt(info.tokenId).email;
        var idGreenHouse = parseJwt(info.payload).Id_AgronoMek;

        var user = await User.findOne({
            where: {
                email: email,
                connectedToGreenHouse: true
            }
        })
        if(!user.email){
            res.status(404).send({
                message: "Your Greenhouse is already matching :( :( !!"
            })
        }

        console.log(idGreenHouse);
        console.log(user.id);

        var dbFireBase = admin.database();
        var oneGreenHouse = dbFireBase.ref('AgronoMekDB/'+ idGreenHouse + '/')

        oneGreenHouse.once('value', function(snap){
            const objectTemperature = snap.val().Temperature;
            const lastKeyValueOfTemperature = Object.keys(objectTemperature).pop();
            const lastValueOfTemperature = objectTemperature[lastKeyValueOfTemperature];

            const objectHumidity = snap.val().Humidity;
            const lastKeyValueOfTHumidity = Object.keys(objectHumidity).pop();
            const lastValueOfHumidity = objectHumidity[lastKeyValueOfTHumidity];

           res.status(200).send({
            nameOfGreenHouse: snap.val().Name_GreenHouse,
            valueOfTemperature: lastValueOfTemperature,
            valueOfHumidity: lastValueOfHumidity,
            })
        });

    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}


module.exports = {
    matchTheGreenHouseAndUser,
    getAllInformationOfSpecficGreenHouse,
    getInformationForHomePage
}