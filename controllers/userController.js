const db = require('../models')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// Image upload
const multer = require('multer')
const path = require('path')

// Create main Model
const User = db.users
const Notification = db.notifications

// Call another controllers
const notificationController = require('./notificationController.js');

// Main of work

// 1. Create an user
const addUser = async (req, res) => {
    try{
        let info = {
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            image: req.file.path,
            country: req.body.country,
            connectedToGreenHouse: req.body.connectedToGreenHouse,
            // idGreenHouse: req.body.idGreenHouse
        }

        if(!info.userName || !info.email || !info.image || !info.password || !info){
            res.status(422).send({
                error: "Please add all the fields"
            })
        }
        User.findOne({
            where: {
                email: info.email,
            }
        }).then(savedUser =>{
            if(savedUser){
                res.status(422).send({
                    error: "User already exsist"
                })
            }
        })
        var hashPassword = bcrypt.hashSync(info.password, 10);
        info.password = hashPassword
        const user = await User.create(info)
        res.status(200).send(user)
        console.log(user)

    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}

// 2. Get all of users
const getAllUser = async (req, res) => {
    try{
        let users = await User.findAll({})
        res.status(200).send(users)
        console.log(users)
    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}

// 3. Get all of user by name of email
const getAllUserByEmAndNa = async (req, res) => {
    try{
        let users = await User.findAll({
            attributes: [
                'Name_User',
                'Email_User',
            ]
        })
        res.status(200).send(users)
        console.log(users)
    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}

// 4. Login using the email and password
const loginUser = async (req, res) => {
    try{
        let email = req.body.email
        let password = req.body.password
        if(!email || !password){
            res.status(422).send({
                error: "Please add all the fields"
            })
        }
        try{
            // var user = await User.findOne({
            //     where: {
            //         email: email,
            //     }
            // })
            var data = await User.findOne({
                include: [{
                    model: Notification,
                    as: 'notification'
                }],
                where: {
                    email: email,
                }
            })
        }
        catch(e){
            console.log("Check your email !!")
            res.status(404).send({
                message: "Check your email !!"
            })
        }
        console.log(password)
        console.log(data.password)
        bcrypt.compare(password, data.password).then(doMatch =>{
            console.log(doMatch)
            if(doMatch){
                console.log(data.notification)
                let verificationValue = data.notification[0][Object.keys(data.notification[0])[0]].verify
                if(verificationValue==true){
                    console.log("Yeah your filed all correct and your account it's activate !! :) :)")
                    let dataOfToken = {
                        id: data.id,
                        email: data.email
                    }
                    const token = jwt.sign(dataOfToken, "AgronoMek-xenophon-IT")
                    
                    res.status(200).send({
                        token,
                    })
                }
                else{
                    res.status(404).send({
                        message: "Your Account not activate please check your email :( :( !!"
                    })
                }
            }
            else{
                console.log("No !! :( :(")
                res.status(404).send({
                    message: "Check your email or password !!"
                })
            }
        })
    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}

// 5. Get all notification of an Specification user
const getAllNotificationOfSpecificationUser = async (req, res) => {
    try{
        let email = req.body.email 
        if(!email){
            res.status(422).send({
                error: "Please add all the fields"
            })
        }
        const data = await User.findOne({
            include: [{
                model: Notification,
                as: 'notification'
            }],
            where: {
                email: email,
                // password: hash
            }
        })
        res.status(200).send(data)
    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}

//  Upload Image Controller
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {fieldSize: '1000000'},
    fileFilter: (req, file, cb) =>{
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname){
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('image')

// 6. Forget password function 
const forgetPassword = async (req, res) => {
    try{
        let email = req.body.email
        if(!email){
            res.status(422).send({
                error: "Please add all the fields"
            })
        }
        try{
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
            else{
                var send = notificationController.sendEmail(email,type="forgetPassword")
                console.log('Check the value of send')
                console.log(send)
                if(send !=0){
                    // Create an new notification
                    let newNotification = {
                        verify: true,
                        message: "AgronoMek changed it your password",
                        User_Id: user.id,
                    }
                    const notification = await Notification.create(newNotification)
                    console.log(notification)
                    // Change the password of the user
                    password = "AgronoMek-App"
                    User.findByPk(user.id).then((userInfo) => {
                        if(userInfo.password !== password){
                            const salt = bcrypt.genSaltSync(10)
                            newPassword = bcrypt.hashSync(password, salt)
                            password = newPassword
                        }
                        return password;
                    })
                    .then((password) =>{
                        User.update({
                            password: password,
                        },
                        {
                            where: {
                                email: user.email,
                                id: user.id
                            }
                        }

                        ).then((response) => {
                            console.log("response after update", response);
                            res.status(200).json({
                                message: `User ${user.userName} has been updated`,
                                new_password: user.getDataValue('password')
                            
                            });
                        }).catch((err) =>{
                            console.log(err);
                            res
                                .status(500)
                                .json({ message: "Something went wrong updating the user" });
                            });
                        })
                    
                }
                else{
                    type = 'error'
                    msg = 'Something goes to wrong. Please try again'
                    res.status(200).json({ message: `User ${user.id} has not been updated` });
                }
            }
        }
        catch(e){
            console.log("Check your email !!")
            res.status(404).send({
                message: "Check your email !!"
            })
        }
    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}



module.exports = {
    addUser,
    getAllUser,
    getAllUserByEmAndNa,
    loginUser,
    getAllNotificationOfSpecificationUser,
    upload,
    forgetPassword,
}