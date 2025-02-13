// const nodemailer = require('nodemailer');
// require("dotenv").config();
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: 'gmail',  
//     auth: {
//       user: 'placementconnect9@gmail.com',  
//       pass: 'vbxp xoql egds euuf'      
//     }
//   });
// };
const { getMaxListeners } = require("../models/userModel");
const otpGenerator=require("./OtpGeneration");
const nodemailer = require('nodemailer');
require("dotenv").config();
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',  
    auth: {
      user: 'choudharyshabh2023@gmail.com',  
      pass: 'azuv qydb aosz hkkc'      
    }
  });
};



const sendEmail = (toEmail, subject, text,htmlContent) => {
  console.log("TO email",toEmail);
  const transporter = createTransporter();  
  const mailOptions = {
    from: 'choudharyshabh@gmail.com',  
    to: toEmail,                 
    subject: subject,            
    text: text  ,
    html:htmlContent              
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent successfully: ', info.response);
    }
  });
};




module.exports=sendEmail;


