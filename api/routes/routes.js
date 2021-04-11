"use strict";
module.exports = (app) => {
  const MemberList = require("../gatewayFunctions/memberGateway");
  const GuildGatewayController = require("../gatewayFunctions/guildGateway");
  const AuthGateways = require("../gatewayFunctions/authGateway");
  const auth = require("../proxys/authProxy").authWrapper;
  const monitoring = require("./../../Utils/monitor");

  /**
   *  Un-Authenticated Routes Routes
   */
  // app .route("/api/member")
  //.get(auth, MemberList.listMembers)
  //.post(auth, MemberList.createNewMember);

  app
    .route("/api/member/register")
    // .get(auth, MemberList.listMembers)
    .post(MemberList.createNewMember);

  app
    .route("/api/member/login")
    // .get(auth, MemberList.listMembers)
    .get(MemberList.login);

  /**
   *  Authenticated Routes
   */
  app
    .route("/api/member/:MemberID")
    .get(auth, MemberList.getMemberRecord)
    .put(auth, MemberList.updateMember)
    .delete(auth, MemberList.deleteMember);

  // Routes for getting all guilds a user has access to. and creating guilds.
  app
    .route("/api/guild/:MemberID")
    .get(auth, GuildGatewayController.getGuildsUserCanAccess)
    .post(auth, GuildGatewayController.createGuild);

  // Routes for joining guilds.
  app
    .route("/api/guild/:MemberID/:GuildID/:GuildInvite")
    .get(GuildGatewayController.joinGuild);

  /*
    Authentication gateway for authentication
  */
  app .route("/api/auth/:MemberID")
      .get(AuthGateways.login);


/**
 * Monitoring API
 */

  app .route("/api/monitoring/data")
      .get(monitoring.data);

  
};
