"use strict";
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const MemberSchema = new Schema({
  // Never changed!!!!!!!!!!!!!!!!!!!!!!!   >:(
  id: { type: String, required: "FUCKING GIVE ME ID" },
  createdDate: { type: Date, default: Date.now },

  // Filled in during account creation/modification
  tag: { type: String, required: "A user tag is needed" },
  hash: { type: String, required: "Hash of password is needed" },
  phoneNumber: { type: String, default: "NA" },
  email: { type: String, required: "Need an email for the user" },
  guilds: { type: Array, required: "Default guilds array is needed" },

  // Filled in during first login
  token: { type: String, default: "NA", required: "Token. needed." },
  // Changed on every password based login
  tokenSecret: {
    type: String,
    default: "NA",
    required: "TokenSecret. needed.",
  },
});
module.exports = mongoose.model("Members", MemberSchema);
