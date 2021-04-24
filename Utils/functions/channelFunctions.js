const mongoose = require("mongoose");
const Guilds = mongoose.model("Guilds");
const Members = mongoose.model("Members");

const guildSnowflake = require("../snowflake").GenerateID;
const logging = require("../logging");
const limits = require("./limits");

/**
 * Creates a new channel in the specific guild
 * @param {string} MemberID MemberID of the user that created the channel.
 * @param {string} GuilidID GuildID to create the channel within.
 * @param {string} newChannelName the name for the new channel.
 * @returns {string} Status text.
 */
module.exports.newChannel = async(MemberID, GuilidID, newChannelName) => {
    var cleanedChannelNameRes = limits.channelName(newChannelName);

    if (cleanedChannelNameRes.modified) {
        logging.log("Parsed channel name isnt valid. TODO: Handle this for the client.", "ERROR");
        newChannelName = cleanedChannelNameRes.cleaned;
    }

    var builtJSON = {
        id: guildSnowflake(),
        name: newChannelName,
        desc: "N/A",
        parentID: "N/A",
    };

    MemberID; // Audit Log Creator

    // Create channel in db.
    await Guilds.findOneAndUpdate({ id: GuilidID }, { $push: { channels: builtJSON } });

    return "Ok.";
};