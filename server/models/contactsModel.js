const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ContactsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  contactRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const ContactsModel = mongoose.model("Contacts", ContactsSchema);
module.exports = ContactsModel;
