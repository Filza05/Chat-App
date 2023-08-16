const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const verificationCodeSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  verificationCode: {
    type: Number,
    required: true,
  },
});

const verificationCodeModel = mongoose.model(
  "verificationCode",
  verificationCodeSchema
);

module.exports = verificationCodeModel;
