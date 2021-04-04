'use strict';
const codes = require("./error_codes").codes;

const mongoose = require('mongoose');
const Members = mongoose.model('Members');

const logging = require('./logging');

exports.auth = (req, res) => {
    Members.find({id: req.body.clientMemberID, token: req.body.clientToken}, (err, Response) => {
    if (err) {
      res.status(codes.Bad_Request);
      res.send(err);
    }

    logging.log(`Token valid. ${req.body.clientMemberID} - token: ${req.body.clientToken}`)
    // Token is valid
    res.json(Response);
  });
};
