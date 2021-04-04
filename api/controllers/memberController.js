"use strict";
const codes = require("../../Utils/error_codes").codes;

const mongoose = require("mongoose"),
  Members = mongoose.model("Members");

const logging = require("../../Utils/logging");

exports.listMembers = (req, res) => {
  Members.find({}, (err, Response) => {
    if (err) res.send(err);
    res.json(Response);
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    logging.log(`[ ${ip} ] - /Members`);
  });
};
exports.createNewMember = (req, res) => {
  let tmp_NewMember = new Members(req.body);
  tmp_NewMember.save((err, Response) => {
    if (err) {
      res.status(codes.Bad_Request);
      res.send(err);
      return;
    }
    res.status(codes.Ok);
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    logging.log(`[ ${ip} ] - /Members`);
    res.json(Response);
  });
};
exports.getMemberRecord = (req, res) => {
  Members.find({ id: req.params.MemberID }, (err, Response) => {
    if (err) {
      res.status(codes.Bad_Request);
      res.send(err);
    }
    res.json(Response);
  });
};
exports.updateMember = (req, res) => {
  Members.findOneAndUpdate(
    { id: req.params.MemberID },
    req.body,
    { new: true },
    (err, Response) => {
      if (err) {
        res.status(codes.Bad_Request);
        res.send(err);
      }

      res.status(codes.Accepted);
      res.json(Response);
    }
  );
};
exports.deleteMember = (req, res) => {
  Members.find({ id: req.params.MemberID }, (err, Response) => {
    if (err) {
      res.send(err);
    }
    if (!Response || Response[0] == undefined || Response == []) {
      var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logging.log(`[ ${ip} ] - Tried to delete a member that doesnt exist.`);
      res.status(codes.Not_Found);
      res.json({
        message: "Member doesnt exist.",
        error_code: codes.Not_Found,
      });
      return;
    }
    Members.deleteOne({ id: req.params.MemberID }, (err, DeleteResponse) => {
      if (err) res.send(err);

      var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      logging.log(`[ ${ip} ] - Deleted member ${Response[0].Tag}.`);

      res.status(codes.Accepted);
      res.json({ message: `Member ${Response[0].Tag} successfully deleted` });
    });
  });
};
