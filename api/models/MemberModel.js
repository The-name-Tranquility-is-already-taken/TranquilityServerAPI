"use strict";
const mongoose = require("mongoose");
// const Snowflake = require("../../Utils/snowflake").GenerateID;

const Schema = mongoose.Schema;
const MemberSchema = new Schema({
  id: { type: String, default: "Snowflake" },
  createdDate: { type: Date, default: Date.now },
  tag: { type: String, required: "A user tag is needed" },
  hash: { type: String, required: "Hash of password is needed" },
  phoneNumber: { type: String, required: "Need a phone number" },
  email: { type: String, required: "Need an email for the user" },
  guilds: { type: Array, required: "Default guilds array is needed"},
  token:        { type: String, default: "NA", required: "Token. needed."},
  tokenSecret:  { type: String, default: "NA", required: "TokenSecret. needed."},
});
module.exports = mongoose.model("Members", MemberSchema);
