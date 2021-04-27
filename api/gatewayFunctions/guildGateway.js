"use strict";
const codes = require("../../Utils/misc/error_codes").codes;

const guildFunctions = require("../../Utils/functions/guildFunctions");

const logging = require("../../Utils/logging");
const monitoring = require("../../Utils/monitor");

exports.getGuildsUserCanAccess = async(req, res) => {
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
    res.send({ response: ress });

    let end = new Date().getTime();
    var duration = end - startTimestamp;

    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    logging.log(`[ ${duration}ms ] - [ ${ip} ] - /guild/${memberID}`);
    monitoring.log("guildGateway - getGuildsUserCanAccess", duration);
};

/**
 * Used to create a guild
 * @param {*} req
 * @param {*} res
 */
exports.createGuild = async(req, res) => {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let startTimestamp = new Date().getTime();

    var ownerID = req.params.MemberID;
    var guildName = req.body.name;

    var response = await guildFunctions
        .newGuild(ownerID, guildName)
        .catch((err) => {
            console.log("ERR: ", err);
            return "err";
        });
    if (response == "err") {
        res.status(codes.Bad_Request);
    } else {
        res.status(codes.Ok);
    }
    res.json({ response: response });

    let end = new Date().getTime();
    var duration = end - startTimestamp;
    logging.log(
        `[ ${duration}ms ] - [ ${ip} ] - POST /guild/${ownerID} - name: ${guildName}`
    );
    monitoring.log("guildGateway - createGuild", duration);
};

/**
 * Used to join a guild
 * @param {*} req
 * @param {*} res
 */
exports.joinGuild = async(req, res) => {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let startTimestamp = new Date().getTime();

    // Handling passed params
    var memberID = req.params.MemberID;
    var guildID = req.params.GuildID;
    var GuildInvite = req.params.GuildInvite;

    var response = await guildFunctions
        .joinGuild(memberID, guildID, GuildInvite)
        .catch((err) => {
            console.log("ERR: ", err);
            console.error(err);
            return "err";
        });
    if (response == "err") {
        res.status(codes.Bad_Request);
    } else {
        res.status(codes.Ok);
    }
    res.send({ response: response });

    let end = new Date().getTime();
    var duration = end - startTimestamp;

    logging.log(
        `[ ${duration}ms ] - [ ${ip} ] - POST /guild/${memberID}/${guildID}/${GuildInvite}`
    );

    monitoring.log("guildGateway - joinGuild", duration);
};