"use strict";
const codes = require("../../Utils/misc/error_codes").codes;

const mongoose = require("mongoose");
const servers = require("./../../Databases/DBs").getServers();

const Members = mongoose.connection.model("Members");
const logging = require("@connibug/js-logging");
const monitoring = require("../../Utils/monitor");
const phoneFunctions = require("../../Utils/functions/phoneFunctions");

// exports.login = async(req, res) => {
//     logging.log(
//         `Trying to login as. ${req.params.MemberID} - providing hash:
//         -${req.body.hash}-`
//     );
//     var member = await Members.find({ id: req.params.MemberID, hash:
//     req.body.hash }).catch(e => {
//         res.status(codes.Bad_Request);
//         res.send(err);
//     });

//     if (member.length == 0) {
//         res.status(codes.Not_Found);
//         res.send(err);
//     } else {
//         res.status(codes.Ok);
//         res.json(Response);
//     }
// };

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

/**
 * Gateway used to start the process of verifying ownership of a phone number
 * @param {*} req
 * @param {*} res
 */
exports.verifPhone = async (req, res) => {
  let startTimestamp = new Date().getTime();
  var phonenumber = req.params.PhoneNumber;
  var memberID = req.params.MemberID;

  var response = await phoneFunctions
    .setupPhone2FA(memberID, phonenumber)
    .catch((err) => {
      // console.log("ERR: ", err);
      logging.log(err, "ERROR");
      return "err";
    });

  if (response == "err") {
    res.status(codes.Bad_Request);
  } else {
    res.status(codes.Ok);
  }
  res.json({ response: response });

  monitoring.log("verifPhone", new Date().getTime() - startTimestamp);
};

exports.verifEmail = (req, res) => {};
