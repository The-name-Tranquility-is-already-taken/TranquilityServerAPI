"use strict";
const codes = require("../../Utils/misc/error_codes").codes;

const mongoose = require("mongoose"),
  Members = mongoose.model("Members");

const memberFunctions = require("../../Utils/functions/memberFunctions");

const logging = require("../../Utils/logging");
const monitoring = require("../../Utils/monitor");

async function getMemberRecord(memberID) {
  var member = await Members.find({ id: memberID }).catch((err) => {
    if (err) {
      console.log(err);
      logging.log("getMemberRecord had an error", "ERROR");
    }
  });
  return member;
}

exports.getMemberInfo = async (memberID) => {
  return await getMemberRecord(memberID);
};

/**
 * Get all members within database.
 * @param {any} req
 * @param {any} res
 */
exports.listMembers = async (req, res) => {
  let startTimestamp = new Date().getTime();

  var memberArray = await memberFunctions.getAllMembers().catch((err) => {
    console.log("ERR: ", err);

    res.status(codes.Bad_Request);
    res.send("err");
  });
  res.status(codes.Ok);
  res.json(memberArray);

  let end = new Date().getTime();
  var duration = end - startTimestamp;

  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logging.log(`[ ${duration}ms ] - [ ${ip} ] - List members`);
};

exports.createNewMember = async (req, res) => {
  let startTimestamp = new Date().getTime();

  var response = await memberFunctions
    .createNewMember(req.body)
    .catch((err) => {
      console.log("ERR: ", err);
      res.status(codes.Bad_Request);
      return "err";
    });
  if (typeof response != "object" && response.includes("exists")) {
    res.status(codes.Conflict);
    res.send({ error: response });
    return;
  }
  if (response == "err") {
    res.status(codes.Bad_Request);
  } else {
    res.status(codes.Ok);
  }
  res.json({ response: { id: response } });

  monitoring.log(
    "createNewMember - gateway",
    new Date().getTime() - startTimestamp
  );
};

exports.getMemberRecord = (req, res) => {
  res.json(getMemberRecord(req.params.MemberID));
};

exports.updateMember = (req, res) => {
  res.status(codes.Bad_Request);
  res.send("Disabled gateway.");
  // var response = Members.findOneAndUpdate({ id: req.params.MemberID
  // },req.body, { new: true }
  //     console.log("ERR: ", err);
  //     return ("err");
  // });

  // if (response == "err") {
  //     res.status(codes.Bad_Request);
  // } else {
  //     res.status(codes.Ok);
  // }
  // Members.findOneAndUpdate({ id: req.params.MemberID },
  //     req.body, { new: true },
  //     (err, Response) => {
  //         if (err) {
  //             res.status(codes.Bad_Request);
  //             res.send(err);
  //             return;
  //         }

  //         res.status(codes.Accepted);
  //         res.json(Response);
  //     }
  // );
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
      res.json({
        message: `Member ${req.params.MemberID} successfully deleted`,
      });
    });
  });
};
exports.login = async (req, res) => {
  let startTimestamp = new Date().getTime();

  var response = await memberFunctions.memberLogin(req.body).catch((err) => {
    console.log("ERR: ", err);
    res.status(codes.Bad_Request);
    return "err";
  });

  if (response == "err") {
    res.status(codes.Bad_Request);
  } else {
    res.status(codes.Ok);
  }
  res.json({ response: response });

  monitoring.log("login - valid", new Date().getTime() - startTimestamp);
};
