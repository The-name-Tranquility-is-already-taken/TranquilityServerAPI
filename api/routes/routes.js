"use strict";
module.exports = (app) => {
  const MemberList = require("../controllers/memberController");
  const GuildGatewayController = require("../controllers/guildController");
  const AuthGateways = require("../controllers/authGateways");

  app .route("/api/member")
      .get(MemberList.listMembers)
      .post(MemberList.createNewMember);

  app .route("/api/member/:MemberID")
      .get(MemberList.getMemberRecord)
      .put(MemberList.updateMember)
      .delete(MemberList.deleteMember);

      // Routes for getting all guilds a user has access to. and creating guilds.
  app .route("/api/guild/:MemberID")
      .get(GuildGatewayController.getGuilds)
      .post(GuildGatewayController.createGuild);

      // Routes for joining guilds.
  app .route("/api/guild/:MemberID/:GuildID/:GuildInvite")
      .get(GuildGatewayController.joinGuild);

  /*
    Authentication gateway for authentication
    /api/auth/:MemberID?hash=base64hash???
  */
  app .route("/api/auth/:MemberID")
      .get(AuthGateways.login);
};
