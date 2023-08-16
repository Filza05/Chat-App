const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const verificationCodeModel = require("../models/verificationCodeModel");
const sendVerificationCode = require("../utils/emailVerificationCode");

const Router = express.Router();

Router.post("/request-sign-up", async (req, res) => {
  const user = req.body;
  const email = user.email;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already registered" });
  }

  try {
    await sendVerificationCode(user.email);
    res
      .status(201)
      .json({ message: "verification code sent succesfully" });
  } catch (error) {
    console.log(error);
  }
});

Router.post("/verify-sign-up/:verificationCode", async (req, res) => {
  const user = req.body;
  const { verificationCode } = req.params;

  const response = await verificationCodeModel.findOne({
    email: user.email,
    verificationCode: verificationCode,
  });

  if (response) {
    user.password = await bcrypt.hash(user.password, 12);
    const newUser = new UserModel(user);

    try {
      const userDoc = await newUser.save();
      console.log("user saved to database");
      res.status(201).json(userDoc);
    } catch (error) {
      res.status(500).json("internal server error");
    }
  } else {
    console.log("verificationCode did not match");
    res.status(409).json({ message: "verificationCode did not match" });
  }
});

module.exports = { Router };
