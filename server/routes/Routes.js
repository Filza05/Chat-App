const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const sendVerificationCode = require("../Utils/emailVerificationCode");

const Router = express.Router();

Router.post("/sign-up", async (req, res) => {
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

  // const newUser = new UserModel(user);
  // user.password = await bcrypt.hash(user.password, 12);

  // try {
  //   const userDoc = await newUser.save();
  //   console.log("user saved to database");
  //   res.status(201).json(userDoc);
  // } catch (error) {
  //   res.status(500).json("internal server error");
  // }
});

module.exports = { Router };
