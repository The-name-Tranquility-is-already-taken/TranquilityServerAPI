const messageFunctions = require("../../Utils/functions/messageFunctions");
const codes = require("../../Utils/misc/error_codes").codes;
const logging = require("../../Utils/logging");
const monitoring = require("../../Utils/monitor");

/**
 * Used to send messages
 * @param {*} req
 * @param {*} res
 */
exports.sendMessageInChannel = async (req, res) => {
  //   /api/message/:MemberID/guild/:GuildID/channel/:ChannelID
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  let startTimestamp = new Date().getTime();

  var MemberID = req.params.MemberID;
  var GuildID = req.params.GuildID;
  var ChannelID = req.params.GuildID;

  var content = req.body.content;

  var response = await messageFunctions
    .sendMessage(content, MemberID, ChannelID, GuildID)
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
    `[ ${duration}ms ] - [ ${ip} ] - POST /message/${MemberID}/guild/${GuildID}/channel/${ChannelID}  - content: ${content}`
  );

  monitoring.log("sendMessage", duration);
};
