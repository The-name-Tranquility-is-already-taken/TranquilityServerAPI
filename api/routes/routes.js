"use strict";
module.exports = (app) => {
  const memberGateway = require("../gatewayFunctions/memberGateway");
  const guildGateway = require("../gatewayFunctions/guildGateway");
  const authenticationGateway = require("../gatewayFunctions/authGateway");
  const smsGateway = require("../gatewayFunctions/smsGateway.js");

  const authWrapper = require("../proxys/authProxy").authWrapper;

  const monitoringUtils = require("./../../Utils/monitor");

  /**
   *  Un-Authenticated Routes
   */
  //#region Un-Authenticated Routes

  app.route("/api/member/register").post(memberGateway.createNewMember);

  app.route("/api/member/login").get(memberGateway.login);

  //#endregion

  /**
   *  Authenticated Routes
   */
  //#region Authenticated Routes

  // start verification process
  app
    .route("/api/auth/:MemberID/verify/phone/:PhoneNumber")
    .post(authWrapper, authenticationGateway.verifPhone);

  app
    .route("/api/member/:MemberID")
    .get(authWrapper, memberGateway.getMemberRecord)
    .put(authWrapper, memberGateway.updateMember)
    .delete(authWrapper, memberGateway.deleteMember);

  // Routes for getting all guilds a user has access to. and creating guilds.
  app
    .route("/api/guild/:MemberID")
    .get(authWrapper, guildGateway.getGuildsUserCanAccess)
    .post(authWrapper, guildGateway.createGuild);

  // Routes for joining guilds.
  app
    .route("/api/guild/:MemberID/:GuildID/:GuildInvite")
    .get(guildGateway.joinGuild);
  //#endregion

  /**
   * Monitoring API
   */
  //#region Monitoring API

  app.route("/api/monitoring/data").get(monitoringUtils.data);

  //#endregion

  /**
   *  SMS Gateways
   */
  //#region SMS Gateways

  app.route("/api/sms/new").post(smsGateway.newSMS);

  //#endregion
};
