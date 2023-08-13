const express = require("express");
const UserModel = require("../models/userModel");

const Router = express.Router();

Router.post("/sign-up", async (req, res) => {
  const user = req.body;
  console.log(user);
  const newUser = new UserModel(user);

  try {
    const userDoc = await newUser.save();
    console.log("user saved to database");
    res.status(201).json(userDoc);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = { Router };
