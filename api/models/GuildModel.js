"use strict";
const mongoose = require("mongoose");
const Snowflake = require("../../Utils/snowflake").GenerateID;

const Schema = mongoose.Schema;
const GuildSchema = new Schema({
  id : {type : String, default : Snowflake},
  ownerID : {type : String, required : "Damn no owner, kinda sus."},
  createdDate : {type : Date, default : Date.now},
  name : {type : String, required : "Guilds Name Tag"},
  description : {
    type : String,
    default : "Please set",
    required : "Guilds description Tag",
  },
  channels : {type : Array, required : "Channels Array"},
  // [
  //   {
  //     "channelID": 323131,
  //     "channelName": 4234234,
  //     "buckets": [
  //       {
  //         "id": 1,
  //       },
  //       {
  //         "id": 2,
  //       },
  //       {
  //         "id": 3,
  //         "active": true
  //       }
  //     ]
  //   }
  // ],
  members : {
    type : Array,
    required : "Members lists are kinda importent my guy :/",
  },
});
module.exports = mongoose.model("Guilds", GuildSchema);
