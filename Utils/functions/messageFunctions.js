const mongoose = require("mongoose");
const Guilds = mongoose.model("Guilds");
const Members = mongoose.model("Members");

const guildSnowflake = require("../snowflake").GenerateID;
const logging = require("../logging");
const limits = require("./limits");

/**
 * Creates a new channel in the specific guild
 * @param {string} MessageContent The message text
 * @param {string} SenderID ID of the user that sent the message 
 * @param {string} RecipicantID Either channel id or DM User ID
 * @param {string} GuilidID Only if message was sent in channel
 * @returns {string} Status text.
 */
module.exports.sendMessage = async(MessageContent, SenderID, RecipicantID, GuilidID = "N/A") => {
    var cleanedMessageTextRes = limits.messageText(MessageContent);

    if(cleanedMessageTextRes.modified) {
        logging.log("Parsed message text isnt valid. TODO: Handle this for the client.", "WARNING");
        console.log(cleanedMessageTextRes);
        MessageContent = cleanedMessageTextRes.cleaned;
    }

    var builtJSON = {};
    if(GuilidID != "N/A") {
        // Guild message

        builtJSON = {
            id: guildSnowflake(false),
            messageType: "channel",
            content: MessageContent,
            authorID: SenderID,
            channelID: RecipicantID,
            guildID: GuilidID,
        };
    } else {
        // DM Message

        builtJSON = {
            id: guildSnowflake(false),
            messageType: "DMs",
            content: MessageContent,
            authorID: SenderID,
            recipicantID: RecipicantID,
        };
    }


    console.log("Recieved message:", builtJSON);

    // // Create channel in db.
    // var res = await Guilds.findOneAndUpdate({ id: GuilidID }, { $push: { channels: builtJSON } });
    // if(res == null) {
    //     throw "Guild Doesnt Exist"
    // }

    return builtJSON;
};