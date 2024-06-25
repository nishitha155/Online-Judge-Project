const { isValidObjectId } = require('mongoose');
const nodemailer=require('nodemailer')

const VerificationToken = require('../models/verificationToken');
let otp=''
exports.generateOTP=()=>{
    const otp=`${Math.floor(1000+Math.random()*9000)}`;
    return otp;
  }


exports.mailTransport=()=>nodemailer.createTransport({
       host:"smtp-mail.outlook.com",  // Use environment variable for SECURE
    auth: {
        user: 'charugundlalakshminishitha@gmail.com', // Use environment variable for USERNAME
        pass: 'lnishitha@123'  // Use environment variable for PASSWORD
    }
    })


exports.generateEmailTemplate=code=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style>
    @media only screen and (max-width: 620px) {
    h1{
    font-size:12px;
    padding:5px;
    }
}
    </style>
    </head>
    <body>
    <div>
    <div style="max-width:620px;margin:0 auto;background-color:#f5f5f5;padding:30px;border-radius:5px";font-family:sans-serif;color:#272727;>
    <h1 style="background:#f6f6f6;padding:10px;text-align:center;font-size:30px;color:#272727;font-weight:bold;">OTP Verification</h1>
    <P>Please verify your account by entering the OTP sent to your email.</P>
    <p style="width:80px;margin:0 auto;font-weight:bold;text-align:center;background:#f6f6f6;border-radius:5px;font-size:25px;">${code}</p>
    </div>
    </div>
    </body>
    </html>
    `
}


exports.plainEmailTemplate=(heading,message)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style>
    @media only screen and (max-width: 620px) {
    h1{
    font-size:20px;
    padding:5px;
    }
}
    </style>
    </head>
    <body>
    <div>
    <div style="max-width:620px;margin:0 auto;background-color:#f5f5f5;padding:30px;border-radius:5px";font-family:sans-serif;color:#272727;>
    <h1 style="background:#f6f6f6;padding:10px;text-align:center;font-size:30px;color:#272727;font-weight:bold;">${heading}</h1>
    <P>Please verify your account by entering the OTP sent to your email.</P>
    <p style="width:80px;margin:0 auto;font-weight:bold;text-align:center;background:#f6f6f6;border-radius:5px;font-size:25px;">${message}</p>
    </div>
    </div>
    </body>
    </html>
    `
}

