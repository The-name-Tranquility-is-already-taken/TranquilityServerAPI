"use strict";
const codes = require("../../Utils/error_codes").codes;

const mongoose = require("mongoose"),
Guilds = mongoose.model("Guilds"),
Members = mongoose.model("Members");

const logging = require("../../Utils/logging");

// Allocate a new unique guild id
function allocateNewGuildID() {
  return 2;
}

// Get the guilds by member id the user is in.
async function getGuilds(memberID) {
  var result = await Members.find({ id: memberID });
  
  return ({ 
    HTTP_CODE: codes.Ok,
    HTTP_JSON: result[0].guilds,
  });
}
// Create a new guild.
async function newGuild(ownerID, guildName) {
    // Build json to parse for the new guild.
    var guildJSON = {
      id: `${allocateNewGuildID()}`,
      name: guildName,
      ownerID: ownerID,
    };
  
    // Create and save guild.
    let tmp_NewGuild = new Guilds(guildJSON);
    var response = await tmp_NewGuild.save()
    .catch(e => {
      console.log(e);
      logging.log("ERROR - newGuild function");

      return ({ 
        HTTP_CODE: codes.Bad_Request,
        HTTP_JSON: {response: "ERR"},
      });
    }); 
  
    // Automatically join guild after creating it.
    var ress = await joinGuild(ownerID, guildJSON.id, "FIRST");
  
    return ({ 
      HTTP_CODE: ress.HTTP_CODE,
      HTTP_JSON: ress.HTTP_JSON,
    });
}
// Join a guild.
async function joinGuild(memberID, guildID, InviteCode) {
  // get the user object.
  var member = await Members.find({ id: memberID }).catch(err => {
    logging.log("An error has happened.", "ERROR");
    console.log(err);
    return ({ 
      HTTP_CODE: codes.Bad_Request,
      HTTP_JSON: {response: "ERR"},
    });
  });

  // Clean and check member object.
  member = member[0];
  if(!member) {
    return { 
      HTTP_CODE: codes.Bad_Request,
      HTTP_JSON: {response: "Invalid UserID."},
    };
  }

  // Check if user is already within the guild.
  var alreadyInGuild = false;
  member.guilds.forEach(e => {
    if(e == guildID) {
      alreadyInGuild = true;
      logging.log("User already within guild.");
      return ({ 
        HTTP_CODE: codes.Conflict,
        HTTP_JSON: {response: "User already within guild."},
      });
    }
  });
  if(alreadyInGuild) {
    return { 
      HTTP_CODE: codes.Conflict,
      HTTP_JSON: {response: "User already within guild."},
    };
  }
  logging.log("User isnt within guild.");

  // TODO: Invite code verification here via 
  InviteCode;

  // Add new member to guild object.
  member.guilds.push(guildID);

  // Update database with new object.
  await Members.findOneAndUpdate({ id: memberID }, member, { new: true })
    .catch(err => {
      logging.log("An error has happened.", "ERROR");
      console.log(err);
      
      return { 
        HTTP_CODE: codes.Bad_Request,
        HTTP_JSON: {response: "ERR"},
      };     
    });

  // Return success code.
  return { 
    HTTP_CODE: codes.Accepted,
    HTTP_JSON: {response: "Success."},
  };
}


exports.getGuilds = async (req, res) => {
  let startTimestamp = (new Date()).getTime();

  var memberID = req.params.MemberID;

  var ress = await getGuilds(memberID);
  res.status(ress.HTTP_CODE);
  res.send  (ress.HTTP_JSON);

  let end = (new Date()).getTime()
  var duration = end-startTimestamp;

  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logging.log(`[ ${duration}ms ] - [ ${ip} ] - /guild/${memberID}` );

};
exports.createGuild = async (req, res) => {
  let startTimestamp = (new Date()).getTime();

  var ownerID = req.params.MemberID;
  var guildName = req.params.MemberID;

  var ress = await newGuild(ownerID, guildName);
  res.status(ress.HTTP_CODE);
  res.send  (ress.HTTP_JSON);

  let end = (new Date()).getTime()
  var duration = end-startTimestamp;

  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logging.log(`[ ${duration}ms ] - [ ${ip} ] - POST /guild/${ownerID} - name: ${guildName}` );
};
exports.joinGuild = async (req, res)  => {
  let startTimestamp = (new Date()).getTime();

  var memberID = req.params.MemberID;
  var guildID = req.params.GuildID;
  var GuildInvite = req.params.GuildInvite;

  var ress = await joinGuild(memberID, guildID, GuildInvite);
  res.status(ress.HTTP_CODE);
  res.send  (ress.HTTP_JSON);

  let end = (new Date()).getTime()
  var duration = end-startTimestamp;

  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logging.log(`[ ${duration}ms ] - [ ${ip} ] - POST /guild/${memberID}/${guildID}/${GuildInvite}` );


};
