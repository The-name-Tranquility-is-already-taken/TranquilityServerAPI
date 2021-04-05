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

  app .route("/api/guild/:MemberID")

      .get(GuildGatewayController.getGuilds)
      .post(GuildGatewayController.createGuild);

  app .route("/api/guild/:MemberID/:GuildID")

      .get(GuildGatewayController.joinGuild);

  /*
    Authentication gateway for authentication
    /api/auth/:MemberID?hash=base64hash???
  */
  app .route("/api/auth/:MemberID")

      .get(AuthGateways.login);
};
