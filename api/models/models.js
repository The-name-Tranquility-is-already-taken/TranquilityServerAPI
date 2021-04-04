'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MemberSchema = new Schema({
  id: {
    type: String,
    required: 'A member id is needed'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  tag: {
      type: String,
      required: 'A user tag is needed'
  },
  hash: {
    type: String,
    required: 'Hash of password is needed'
  },
  phoneNumber: {
      type: String,
      required: 'Need a phone number'
    },
  email: {
      type: String,
      required: 'Need an email for the user'
    },
});
module.exports = mongoose.model('Members', MemberSchema);

const GuildSchema = new Schema({
  id: {
    type: String,
    required: 'A Guild ID is needed'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  name: {
      type: String,
      required: 'Guilds Name Tag'
  },
  description: {
      type: String,
      required: 'Guilds description Tag'
  }
});
module.exports = mongoose.model('Members', MemberSchema);