"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GuildSchema = new Schema({
  id: { type: String, required: "A Guild ID is needed" },

  createdDate: { type: Date, default: Date.now },

  name: { type: String, required: "Guilds Name Tag" },

  description: { type: String, required: "Guilds description Tag" },

  channels: { type: Array, required: "Channels Array" },
});
module.exports = mongoose.model("Guilds", GuildSchema);