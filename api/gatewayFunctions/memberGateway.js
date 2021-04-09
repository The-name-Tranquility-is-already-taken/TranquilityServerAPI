"use strict";
const codes = require("../../Utils/error_codes").codes;

const mongoose = require("mongoose"),
  Members = mongoose.model("Members");

const logging = require("../../Utils/logging");

// Returns an array containing all memberData
async function listAllMembers() {
  var memberArray = await Members.find({}).catch(err => {
    if (err) {
      console.log(err);
      logging.log("List all members had an error", "ERROR");
    }
  });
  return memberArray;
}

async function getMemberRecord(memberID) {
  var member = await Members.find({ id: memberID }).catch(err => {
    if (err) {
      console.log(err);
      logging.log("getMemberRecord had an error", "ERROR");
    }
  });
  return member;
}

exports.getMemberInfo = async (memberID) => {
  return await getMemberRecord(memberID);
}

exports.listMembers = async (req, res) => {
  var memberArray = await listAllMembers();
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logging.log(`[ ${ip} ] - /Members`);

  res.json(memberArray);
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
  // Members.find({ id: req.params.MemberID }, (err, Response) => {
  //   if (err) {
  //     res.status(codes.Bad_Request);
  //     res.send(err);
  //   }
  //   res.json(Response);
  // });
  res.json(getMemberRecord(req.params.MemberID));
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
      logging.log(`[ ${ip} ] - Deleted member ${req.params.MemberID}.`);

      res.status(codes.Accepted);
      res.json({ message: `Member ${req.params.MemberID} successfully deleted` });
    });
  });
};
