"use strict";
const codes = require("../../Utils/error_codes").codes;

const mongoose = require("mongoose");
const Members = mongoose.model("Members");

const logging = require("../../Utils/logging");

exports.login = async (req, res) => {
  logging.log(
    `Trying to login as. ${req.params.MemberID} - providing hash: -${req.body.hash}-`
  );
  var member = await Members.find({
    id: req.params.MemberID,
    hash: req.body.hash,
  }).catch((e) => {
    res.status(codes.Bad_Request);
    res.send(err);
  });

  if (member.length == 0) {
    res.status(codes.Not_Found);
    res.send(err);
  } else {
    res.status(codes.Ok);
    res.json(Response);
  }
};

exports.reauth = (req, res) => {
  logging.log(
    `Trying to login as. ${req.params.MemberID} - providing hash: -${req.body.hash}-`
  );
  Members.find(
    { MemberID: req.params.MemberID, hash: req.body.hash },
    (err, Response) => {
      if (err) {
        res.status(codes.Bad_Request);
        res.send(err);
      }
      if (Response.length == 0) {
        res.status(codes.Not_Found);
        res.send(err);
      } else {
        res.status(codes.Ok);
        res.json(Response);
      }
    }
  );
};
