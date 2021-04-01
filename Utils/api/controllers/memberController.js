'use strict';
const codes = require("../../error_codes").codes;

const mongoose = require('mongoose'),
    Members = mongoose.model('Members');

const logging = require('../../logging');
 
exports.listMembers = (req, res) => {
    Members.find({}, (err, Response) => {
      if (err)
        res.send(err);
      res.json(Response);
      logging.log("[ IP ] - /Members");
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
    if(req.body.secretKey == process.env.secretKey)
    {
      res.status(codes.Ok);
      logging.log("[ IP ] - /Members");
      res.json(Response);
    }
    else {
      res.status(codes.Unauthorized);
      res.send("UN-AUTHENTICATED");
    }
  });
};
exports.getMemberRecord = (req, res) => {
    Members.find({MemberID: req.params.MemberID}, (err, Response) => {
    if (err) {
      res.status(codes.Bad_Request);
      res.send(err);
    }
    res.json(Response);
  });
};
exports.update_a_member = (req, res) => {
    Members.findOneAndUpdate(
      {
        MemberID: req.params.MemberID,
        Token: req.body.token
      }, req.body, {new: true}, (err, Response) => {
    if (err) {
      res.status(codes.Bad_Request);
      res.send(err);
    }

    res.status(codes.Accepted);
    res.json(Response);
  });
};
exports.delete_a_member = (req, res) => {
  Members.find({MemberID: req.params.MemberID}, (err, Response) => {
    if (err) {
        res.send(err);
    }
    if(!Response || Response[0] == undefined || Response == undefined || Response == []) {
      logging.log("[ IP ] - Tried to delete a member that doesnt exist.");
      res.status(codes.Not_Found);
      res.json(
        {   message: "Member doesnt exist.",
            error_code: codes.Not_Found
        }
      );
      return;
    }
    Members.deleteOne(
      {
        MemberID: req.params.MemberID
      }, (err, DeleteResponse) => {
        if (err)
          res.send(err);
        logging.log(`[ IP ] - Deleted member ${Response[0].Tag}.`);
        res.status(codes.Accepted);
        res.json({message: `Member ${Response[0].Tag} successfully deleted`});
    });
  });
};