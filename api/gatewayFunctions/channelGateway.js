const channelFunctions = require("../../Utils/functions/channelFunctions");
const codes = require("../../Utils/misc/error_codes").codes;
const logging = require("../../Utils/logging");
const monitoring = require("../../Utils/monitor");

/**
 * Used to create new channels
 * @param {*} req
 * @param {*} res
 */
exports.createChannel = async(req, res) => {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let startTimestamp = new Date().getTime();

    var MemberID = req.params.MemberID;
    var GuildID = req.params.GuildID;
    var newChannelName = req.body.name;

    var response = await channelFunctions
        .newChannel(MemberID, GuildID, newChannelName)
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
        `[ ${duration}ms ] - [ ${ip} ] - POST /member/${MemberID}/guild/${GuildID}  - name: ${newChannelName}`
    );

    monitoring.log("createChannelGateway", duration);

};