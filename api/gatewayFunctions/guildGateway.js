"use strict";
const codes = require("../../Utils/error_codes").codes;

const guildFunctions = require("../../Utils/functions/guildFunctions");

const logging = require("../../Utils/logging");

exports.getGuildsUserCanAccess = async (req, res) => {
  let startTimestamp = new Date().getTime();

  var memberID = req.params.MemberID;

  var ress = await guildFunctions
    .getGuildsUserCanAccess(memberID)
    .catch((err) => {
      console.log("ERR: ", err);

      res.status(codes.Bad_Request);
      res.send("err");
    });
  if (!ress) {
    res.status(codes.Not_Found);
  } else {
    res.status(codes.Ok);
  }
  res.send(ress);

  let end = new Date().getTime();
  var duration = end - startTimestamp;

  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logging.log(`[ ${duration}ms ] - [ ${ip} ] - /guild/${memberID}`);
};
exports.createGuild = async (req, res) => {
  let startTimestamp = new Date().getTime();

  var ownerID = req.params.MemberID;
  var guildName = req.params.MemberID;

  var ress = await guildFunctions.newGuild(ownerID, guildName).catch((err) => {
    console.log("ERR: ", err);

    res.status(codes.Bad_Request);
    res.send("err");
  });
  res.status(ress.HTTP_CODE);
  res.send(ress.HTTP_JSON);

  let end = new Date().getTime();
  var duration = end - startTimestamp;

  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logging.log(
    `[ ${duration}ms ] - [ ${ip} ] - POST /guild/${ownerID} - name: ${guildName}`
  );
};
exports.joinGuild = async (req, res) => {
  let startTimestamp = new Date().getTime();

  var memberID = req.params.MemberID;
  var guildID = req.params.GuildID;
  var GuildInvite = req.params.GuildInvite;

  await guildFunctions
    .joinGuild(memberID, guildID, GuildInvite)
    .catch((err) => {
      console.log("ERR: ", err);

      res.status(codes.Bad_Request);
      res.send("err");
    });
  res.status(codes.Ok);
  res.send("Joined.");

  let end = new Date().getTime();
  var duration = end - startTimestamp;

  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logging.log(
    `[ ${duration}ms ] - [ ${ip} ] - POST /guild/${memberID}/${guildID}/${GuildInvite}`
  );
};
