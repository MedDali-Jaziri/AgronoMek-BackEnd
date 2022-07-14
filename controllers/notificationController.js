const db = require('../models')
const nodemailer = require('nodemailer')

//  Create main Model
const Notification = db.notifications
const User = db.users
// Main of work

// 1. Create an Notification
const addNotification = async (req, res) => {
    try{
        let info = {
            verify: req.body.verify,
            message: req.body.message,
            User_Id: req.body.User_Id,
        }
        console.log(info)

        if(!info.message || !info.User_Id){
            res.status(422).send({
                error: "Please add all the fields"
            })
        }
        const notification = await Notification.create(info)
        res.status(200).send(notification)
        console.log(notification)
    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}

// Send an email for verification
function sendEmail(email, type) {
    var email = email
    // let token we wil use Token Authenticate

    const mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'agronomekit@gmail.com',
            pass: 'giqyxlaevnazqnvy'
        }
    });

    mail.verify((error, success) => {
        if(error){
            console.log(error)
        }
        else{
            console.log("Ready for messages")
            console.log(success)
        }
    })
    
    if(type=="verificationLink"){
        console.log("Verification link part")
        var mailOptions = {
            from: 'agronomekit@gmail.com',
            to: email,
            subject: 'Email verification - AgronoMek Application',
            html: 'Hello Dear, <br> Welcome in your AgronoMek Application <br> <p>Your requested for email verification kindly use this <a href="http://localhost:3030/api/notification/activationLink/'+email+'">link</a> to verify your email address</p><br> If you ignore this email you cannot login to agronoMek-Application <br> Thank you very much :) :) <br> Technical service: +216 53 786 397 / +216 50 442 930'
        }
    }
    else if(type="forgetPassword"){
        console.log("Forget Password part")
        var mailOptions = {
            from: 'agronomekit@gmail.com',
            to: email,
            subject: 'Email verification - AgronoMek Application',
            html: 'Hello Dear, <br> Welcome in your AgronoMek Application <br> <p>We noticed that you forgot your password, not problem this is you new password <b>AgronoMek-App</b></p><br> If you ignore this email you cannot login to agronoMek-Application <br> Thank you very much :) :) <br> Technical service: +216 53 786 397 / +216 50 442 930'
        }
    }
    mail.sendMail(mailOptions, function(error, info){
        if(error){
            console.log("There is an error")
            return 1
        }
        else{
            console.log("All of thing it's all right")
            return 0
        }
    })
}

// 2. Email sending route with verification link
const sendVerificationLink = async (req, res) => {
    try{
        let email = req.body.email
        if(!email){
            res.status(422).send({
                error: "Please add all the fields"
            })
        }
        console.log(email)
        let type = 'sucess'
        let msg = 'Email already verified'

        const data = await User.findOne({
            include: [{
                model: Notification,
                as: 'notification'
            }],
            where: {
                email: email,
            }
        })
        let verificationValue = data.notification[0][Object.keys(data.notification[0])[0]].verify
        let notificationId = data.notification[0][Object.keys(data.notification[0])[0]].id
        let userId = data.notification[0][Object.keys(data.notification[0])[0]].User_Id
        if(verificationValue == false){
            var send = sendEmail(email, type="verificationLink")
            console.log(send)
            if(send !=0){
                type = 'sucess'
                msg = 'The verification link has been sent to your email address'

                Notification.update({
                    // verify: true,
                    message: msg
                },
                {
                    where: {
                        id: notificationId,
                        User_Id: userId
                    }
                })
            }
            else{
                type = 'error'
                msg = 'Something goes to wrong. Please try again'
            }
        }
        else{
            console.log('2')
            type = 'error'
            msg = 'The Email is not registered with us'
        }

        res.status(200).send({
            type: type,
            message: msg
        })
    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }
}

// 3. Activation link method
const activationLink = async (req, res) => {
    try{
        let email = req.params.email
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
            }
        })
        let notificationId = data.notification[0][Object.keys(data.notification[0])[0]].id
        let userId = data.notification[0][Object.keys(data.notification[0])[0]].User_Id

        Notification.update({
            verify: true,
        },
        {
            where: {
                id: notificationId,
                User_Id: userId
            }
        })

        res.status(200).send({
            message: "Your account is activate with sucess Welcome with us !! :) :)"
        })
    }
    catch(e){
        console.log(e)
        res.status(404).send({
            message: "There is an error !!"
        })
    }

}
module.exports = {
    addNotification,
    sendVerificationLink,
    activationLink,
    sendEmail
}