const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const ContactsModel = require("../models/contactsModel");
const verificationCodeModel = require("../models/verificationCodeModel");
const sendVerificationCode = require("../Utils/emailVerificationCode");
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
      .json({ message: "verification code sent successfully" });
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
      .json({ message: "verification code didn't match" });

  user.password = await bcrypt.hash(user.password, 12);
  const newUser = new UserModel(user);

  try {
    const userDoc = await newUser.save();
    const newContact = new ContactsModel({
      user: userDoc._id,
      contacts: [],
      contactRequests: [],
    });
    const response = await newContact.save();
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

Router.post("/add-request/:id", async (req, res) => {
  const userId = req.body.id;
  const requestMakerId = req.params.id;

  const contact = await ContactsModel.findOne({ user: userId });
  const indexOfContact = contact.contacts.indexOf(requestMakerId);

  if (indexOfContact == -1) {
    return res.status(400).json({
      message: "you are already present in the contacts of the user",
    });
  }

  if (contact.contactRequests.includes(requestMakerId)) {
    return res
      .status(409)
      .json({ message: "request has already been sent" });
  }
  contact.contactRequests.push(requestMakerId);
  await contact.save();
  console.log("request sent");
  return res.status(200).json({ message: "request sent successfully" });
});

Router.post("/accept-request/:id", async (req, res) => {
  const userId = req.body.id;
  const requestMakerId = req.params.id;

  const contact = await ContactsModel.findOne({ user: userId });
  if (!contact) {
    return res.status(400).json({ message: "user not found" });
  }
  const indexOfRequestMaker =
    contact.contactRequests.indexOf(requestMakerId);

  if (indexOfRequestMaker !== -1) {
    return res
      .status(400)
      .json({ message: "this user never sent a request" });
  }
  contact.contactRequests.splice(indexOfRequestMaker);
  contact.contacts.push(requestMakerId);

  const response = await contact.save();
  console.log(response);
  return res.status(200).json({ message: "user added to your contacts" });
});

module.exports = { Router };
