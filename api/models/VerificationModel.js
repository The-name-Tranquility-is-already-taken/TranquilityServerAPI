"use strict";
const mongoose = require("mongoose");

/*

  userID: '6784913793899053056',

  type: 'EMAIL/PHONE',
  content: 'FULL EMAIL OR PHONE NUMBER',
  
  validCode: '234432'
  
  createdDate: { type: Date, default: Date.now }

*/
const Schema = mongoose.Schema;
const VerificationSchema = new Schema({
  userID: { type: String, required: "Ned userID fam." },
  
  type: { type: String, required: "phone num or email." },
  content: { type: String, required: "full phone num or full email." },

  validCode: { type: String, required: "Needs a valid 2fa code" },
  createdDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model("verifications", VerificationSchema);
