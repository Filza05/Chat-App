const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const verificationCodeModel = require("../models/verificationCodeModel");
const sendVerificationCode = require("../utils/emailVerificationCode");
const { createToken } = require("../Utils/helperFunctions");
require("dotenv").config;

const Router = express.Router();
const secret = process.env.SECRET;

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
    res.status(500).json({ message: "internal server error" });
  }
});

Router.post("/verify-sign-up/:verificationCode", async (req, res) => {
  const user = req.body;
  const { verificationCode } = req.params;

  const response = await verificationCodeModel.findOne({
    email: user.email,
    verificationCode: verificationCode,
  });

  if (!response)
    return res
      .status(409)
      .json({ message: "verification code did'nt match" });

  user.password = await bcrypt.hash(user.password, 12);
  const newUser = new UserModel(user);

  try {
    const userDoc = await newUser.save();
    console.log("user saved to database");
    res.status(201).json(userDoc);
  } catch (error) {
    res.status(500).json("internal server error");
  }
});

Router.post("/request-sign-in", async (req, res) => {
  const data = req.body;
  console.log(data);
  let userDoc = await UserModel.findOne({
    email: data.email,
  });

  console.log(userDoc);

  if (!userDoc) {
    return res
      .status(409)
      .json({ message: "no user with this email is registered" });
  }
  response = await bcrypt.compare(data.password, userDoc.password);

  if (!response) {
    return res.status(400).json({ message: "wrong credentials" });
  }
  createToken(data, secret)
    .then((token) => {
      return res.status(200).cookie("token", token).json({
        email: userDoc.email,
        username: userDoc.username,
        id: userDoc._id,
      });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

module.exports = { Router };
