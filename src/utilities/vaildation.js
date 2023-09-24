//function for email pattern
const bcrypt = require('bcrypt');
function validEmail(email) {
    try{
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
    }catch(error){
        throw error;
    }
}
//function for password encryption
async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}
//function for token genearation
const jwt = require('jsonwebtoken');
function generateAccessToken (email) {
    try {
        if (!email) {
            throw new Error("email");
        }
        if (!process.env.TOKEN_SECRET) {
            throw new Error("Token secret not defined in environment variables.");
        }
        return jwt.sign({ email }, process.env.TOKEN_SECRET);
    } catch (error) {
        console.error("Error generating access token:", error);
        throw error; // Rethrow the error to be caught and handled by the caller.
    }
};
//function for email sending 
const nodemailer = require('nodemailer');
function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user:process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        logger: true, // Enable logging
        debug: true   // Enable debugging    
    });

    const mailOptions = {
        from:`"Zohaib Rizwan" <${process.env.EMAIL_USER}>`,
        to:to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
//function for sms
const { Vonage } = require('@vonage/server-sdk');
async function sendSms(phoneNumber,otp) {
    const vonage = new Vonage({
    apiKey:process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
     });
    const from = "Profile App";
    const to=phoneNumber;
    const text = `Your OTP is: ${otp}`;
    await vonage.sms.send({to, from, text})
      .then(resp => { console.log('Message sent successfully'); console.log(resp); })
       .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
       }

//function to genearate OTP
function generateOTP(){
    return Math.floor(10000 + Math.random() * 90000);
};


module.exports = {
    validEmail,
    hashPassword,
    generateAccessToken,
    sendEmail,
    sendSms,
    generateOTP,
};
