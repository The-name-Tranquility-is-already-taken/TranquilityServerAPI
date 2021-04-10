const mongoose = require("mongoose");
const Guilds = mongoose.model("Guilds");
const Members = mongoose.model("Members");

const memberSnowflake = require("../snowflake").GenerateID;

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
    /* var response = */await tmp_NewGuild.save();
  
    // Automatically join guild after creating it.
    /*var ress = */await joinGuild(ownerID, guildJSON.id, "FIRST");
  
    return ("Ok.");
}
  
/**
 * Get a list of all members within database.
 * @returns {Array} List of members/status text.
*/
module.exports.getAllMembers = async() => {
    var memberArray = await Members.find({}).catch(err => {
      if (err) {
        console.log(err);
        logging.log("List all members had an error", "ERROR");
      }
    });
    return memberArray;
}

// Get the guilds by member id the user is in.
module.exports.getGuildsUserCanAccess = async (memberID) => {
      var result = await Members.find({ id: memberID });
      
      if(!result[0]) {
        return undefined;
      }
      return (result[0].guilds);
}
  
// Join a guild.
module.exports.joinGuild = async (memberID, guildID, InviteCode) => {
      // get the user object.
      var member = await Members.find({ id: memberID });
    
      // Clean and check member object.
      member = member[0];
      if(!member) {
        return ("Invalid UserID.");
      }
    
      // Check if user is already within the guild.
      var alreadyInGuild = false;
      member.guilds.forEach(e => {
        if(e == guildID) {
          alreadyInGuild = true;
          logging.log("User already within guild.");
          return ("User already within guild.");
        }
      });
      if(alreadyInGuild) {
        return ("User already within guild.");
      }
      logging.log("User isnt within guild.");
    
      // TODO: Invite code verification here via 
      InviteCode;
    
      // Add new member to guild object.
      member.guilds.push(guildID);
    
      // Update database with new object.
      await Members.findOneAndUpdate({ id: memberID }, member, { new: true });
    
      // Return success code.
      return ("Ok.");
}