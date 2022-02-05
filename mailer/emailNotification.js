"use strict";
const nodemailer = require("nodemailer");
const secret = require('../.secret');

let mailAccount = secret.gmail

// create reusable transporter object using the default SMTP transport
let transporter
function startEmailService(){

  transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    host: mailAccount.host, //"smtp.mail.yahoo.com",
    port: 465,
    secure: true,
    auth: {
      user: mailAccount.email,//"olamideokunola@yahoo.com",
      pass: mailAccount.pwd, // generated ethereal password
    },
  });

  transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email Server is ready to take our messages');
    }
  });
}

startEmailService()

// async..await is not allowed in global scope, must use a wrapper
async function send2FaCode() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // send mail with defined transport object
  console.log(`about to send mail`)
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "olamideolawaleokunola@gmail.com, olamideokunola@yahoo.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

async function sendPasswordResetEmailNotification(email, newToken){
  console.log(`about to send password reset email, email is ${email}`)

  try {
  
    let info = await transporter.sendMail({
      from: '"CryptoBank 👻" <info@crytobankafric.com>', // sender address
      to: email, // list of receivers
      subject: "Reset password ✔", // Subject line
      text: "Reset password?", // plain text body
      html: `<b>Click the link below to reset your password:</b>
      <p>
        <a href='http://localhost:3000/resetPasswordWithToken/${newToken}'>${newToken}</a>
      </p>`, // html body
    });
  
    console.log(`email sent`)
    // console.log(info)
    
    // console.log(info.response.toString())

    return "OK"

  } catch (e) {
    
    console.error(e)
  
  }
}

async function sendAccountDoesNotExistEmailNotification(email){
  try {
    
    let info = await transporter.sendMail({
      from: '"CryptoBank 👻" <info@crytobankafric.com>', // sender address
      to: email, // list of receivers
      subject: "Reset password ✔", // Subject line
      text: "Reset password?", // plain text body
      html: `<b>Password reset not possible</b>
      <p>
        Account does not exist.

        Password reset not possible
      </p>`, // html body
    });

    return "OK"
  } catch (error) {
    console.log(error)
  }
}

async function sendPasswordChangeSuccessfulNotification(email){
  try {
    
    let info = await transporter.sendMail({
      from: '"CryptoBank 👻" <info@crytobankafric.com>', // sender address
      to: email, // list of receivers
      subject: "Password changed ✔", // Subject line
      text: "Password change", // plain text body
      html: `<b>Password change was successful</b>
      <p>
        You can now sign in with your new password
      </p>`, // html body
    });

    return "OK"
  } catch (error) {
    console.log(error)
  }

}

module.exports = { send2FaCode, sendPasswordResetEmailNotification, sendAccountDoesNotExistEmailNotification, sendPasswordChangeSuccessfulNotification }