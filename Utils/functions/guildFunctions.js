const servers = require("./../../Databases/DBs").getServers();
const mongoose = require("mongoose");

const Members = servers[0].Server1.databases.main.model("Members");
const Guilds = servers[0].Server1.databases.main.model("Guilds");

const guildSnowflake = require("../snowflake").GenerateID;
const logging = require("../logging");

/**
 * Get the guilds by member id the user is in.
 * @param {string} ownerID MemberID of the user that created the guild.
 * @param {string} guildName Name of the new guild.
 * @returns {string} Status text.
 */
module.exports.newGuild = async (ownerID, guildName) => {
  // Build json to parse for the new guild.
  var guildJSON = {
    id: `${guildSnowflake()}`,
    name: guildName,
    ownerID: ownerID,
  };

  // Create and save guild.
  let tmp_NewGuild = new Guilds(guildJSON);
  /* var response = */
  await tmp_NewGuild.save();

  // Automatically join guild after creating it.
  var ress = await this.joinGuild(ownerID, guildJSON.id, "FIRST");

  if (ress != "Joined") {
    return "Failed";
  }
  return "Ok.";
};

/**
 * Get the guilds by member id the user is in.
 * @param {string} memberID MemberID of the user get
 *     guild of.
 * @returns {Array} Returns a list of guild objects.
 */
module.exports.getGuildsUserCanAccess = async (memberID) => {
  var result = await Members.find({ id: memberID });

  if (!result[0]) {
    return undefined;
  }
  return { guilds: result[0].guilds };
};

/**
 * Join a guild
 * @param {string} memberID MemberID of the user to
 *     join the guild as.
 * @param {string} guildID GuildID to join
 * @param {string} InviteCode InviteCode to join using.
 * @returns {string} status text.
 */
module.exports.joinGuild = async (memberID, guildID, InviteCode) => {
  // get the user object.
  var member = await Members.find({ id: memberID });

  // Clean and check member object.
  member = member[0];
  if (!member) {
    return "Invalid UserID.";
  }

  // Check if user is already within the guild.
  var alreadyInGuild = false;
  member.guilds.forEach((e) => {
    if (e == guildID) {
      alreadyInGuild = true;
      logging.log("User already within guild.");
      return "User already within guild.";
    }
  });
  if (alreadyInGuild) {
    return "User already within guild.";
  }
  // logging.log("User isnt within guild.");

  // TODO: Invite code verification here via
  InviteCode;

  // Add new member to guild object.
  member.guilds.push(guildID);

  // Update member object with new guild.
  await Members.findOneAndUpdate({ id: memberID }, member, { new: true });

  // Create member id in guilds.
  await Guilds.findOneAndUpdate(
    { id: guildID },
    { $push: { members: memberID } }
  );

  // Return success code.
  return "Joined";
};
