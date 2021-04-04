'use strict';
const codes = require("../../error_codes").codes;

const mongoose = require('mongoose');
const Members = mongoose.model('Members');

const logging = require('../../logging');

exports.login = (req, res) => {
    logging.log(`Trying to login as. ${req.params.MemberID}`);
    Members.find({id: req.params.MemberID, hash: req.body.hash}, (err, Response) => {
    if (err) {
      res.status(codes.Bad_Request);
      res.send(err);
    }
    res.json(Response);
  });
};