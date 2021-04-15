"use strict";
const codes = require("../../Utils/error_codes").codes;

const mongoose = require("mongoose");
const Members = mongoose.model("Members");

const logging = require("../../Utils/logging");
const phoneFunctions = require("../../Utils/functions/phoneFunctions");

// exports.login = async(req, res) => {
//     logging.log(
//         `Trying to login as. ${req.params.MemberID} - providing hash: -${req.body.hash}-`
//     );
//     var member = await Members.find({ id: req.params.MemberID, hash: req.body.hash }).catch(e => {
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
    Members.find({ MemberID: req.params.MemberID, hash: req.body.hash },
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

exports.verifPhone = async(req, res) => {
    let startTimestamp = new Date().getTime();

    var response = await phoneFunctions.memberLogin(req.body).catch((err) => {
        console.log("ERR: ", err);
        res.status(codes.Bad_Request);
        res.send("err");
        return;
    });

    res.status(codes.Ok);
    res.json({ response: response });

    monitoring.log("login - valid", new Date().getTime() - startTimestamp);

}
exports.verifEmail = (req, res) => {

}