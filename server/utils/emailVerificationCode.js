const nodemailer = require("nodemailer");
const verificationCodeModel = require("../models/verificationCodeModel");
require("dotenv").config();

const sendVerificationCode = async (email) => {
  new Promise(async (resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "doritozz807@gmail.com",
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;

    try {
      verificationCodeModel
        .updateOne(
          { email: email },
          { $set: { verificationCode: verificationCode } },
          { upsert: true }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error.message);
        });

      console.log("verification code saved to DB");

      const mailOptions = {
        from: "doritozz807@gmail.com",
        to: email,
        subject: "Email Verification",
        html: `<p>Your verification code is:<span style="background-color: yellow;">${verificationCode}</span></p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return error.message;
        } else {
          console.log("Email sent: " + info.response);
          return "Email sent: " + info.response;
        }
      });
      resolve();
    } catch (error) {
      console.log(error.message);
      reject();
    }
  });
};

module.exports = sendVerificationCode;
