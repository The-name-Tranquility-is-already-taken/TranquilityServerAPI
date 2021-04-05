"use strict";
const codes = require("../../Utils/error_codes").codes;

const mongoose = require("mongoose"),
Guilds = mongoose.model("Guilds"),
Members = mongoose.model("Members");

const logging = require("../../Utils/logging");

exports.getGuilds = (req, res) => {
  Members.find({ id: req.params.MemberID }, (err, Response) => {
    if (err) res.send(err);
    
    res.json(Response);

    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    logging.log(`[ ${ip} ] - /guild/${req.params.MemberID}` );
  });
};
exports.createGuild = (req, res) => {

  var usersGuilds = [];
  // Find member based of id.
  Members.find({ id: req.params.MemberID }, (err, Response) => {
    if (err) {
      res.status(codes.Bad_Request);
      console.log(err);
      logging.log("An error has happened.", "ERROR");
      res.send("ERR");
      return;
    }
    usersGuilds = Response.guilds;
    res.json(usersGuilds);
    return;
  });


  Members.findOneAndUpdate(
    { id: req.params.MemberID },
    req.body,
    { new: true },
    (err, Response) => {
      if (err) {
        res.status(codes.Bad_Request);
        console.log(err);
        logging.log("An error has happened.", "ERROR");
        res.send("ERR");
        return;
      }

      res.status(codes.Accepted);
      res.json(Response);
    }
  );
};
exports.joinGuild = (req, res) => {
  // Find member based of id.
  Members.find({ id: req.params.MemberID }, (err, Response) => {
    if (err) {
      res.status(codes.Bad_Request);
      console.log(err);
      logging.log("An error has happened.", "ERROR");
      res.send("ERR");
      return;
    }
    Response = Response[0];
    var break_t = false;
    
    if(!Response) {
      res.status(codes.Bad_Request);
      console.log(err);
      res.send("Invalid UserID.");
      return;
    }

    Response.guilds.forEach(e => {
      if(e == req.params.GuildID) {
        res.status(codes.Conflict);
        res.send("User already within guild.");
  
        break_t = true;
        return;
      }
    });
    if(break_t) return;

    logging.log("User isnt within guild.");

    // Invite code verification here via 
    req.params.InviteCode;

    Response.guilds.push(req.params.GuildID);
    
    Members.findOneAndUpdate(
      { id: req.params.MemberID },
      Response,
      { new: true },
      (err, Response) => {
        if (err) {
          res.status(codes.Bad_Request);
          console.log(err);
          logging.log("An error has happened.", "ERROR");
          res.send("ERR");
          return;
        }
        res.status(codes.Accepted);
        res.send("Success.");
      }
    );
    return;
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
      return;
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
        return;
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
      return;
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
