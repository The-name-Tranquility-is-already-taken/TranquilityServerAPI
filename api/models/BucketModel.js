"use strict";
const mongoose = require("mongoose");
const Snowflake = require("../../Utils/snowflake").GenerateID;

/*

  id: '6786515934698815488',
  messageType: 'channel',
  content: 'Test',
  authorID: '6784913793899053056',
  channelID: '6784916491973181440',
  guildID: '6784916491973181440' 

  recipicantID: RecipicantID,

*/
const Schema = mongoose.Schema;
const BucketSchema = new Schema({
  id: { type: String, required: "Ned Bucket id fam." },
  messageType: { type: String, required: "Bucket messageType plz ok..." },
  content: { type: String, required: "Bucket content text plz ok..." },
  authorID: { type: String, required: "Bucket authorID text plz ok..." },

  channelID: { type: String },
  guildID: { type: String },

  recipicantID: { type: String },

  createdDate: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Buckets", BucketSchema);
