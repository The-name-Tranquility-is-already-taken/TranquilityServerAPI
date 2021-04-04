'use strict';
module.exports = (app) => {
  const MemberList = require('../controllers/memberController');
  app.route('/api/member')
    .get(MemberList.listMembers)
    .post(MemberList.createNewMember);
  app.route('/api/member/:MemberID')
    .get(MemberList.getMemberRecord)
    .put(MemberList.updateMember)
    .delete(MemberList.deleteMember);
  app.route('/api/member/:MemberID')
    .get(MemberList.getMemberRecord)
    .put(MemberList.updateMember)
    .delete(MemberList.deleteMember);

    /*

    Authentication gateway for authentication
    /api/auth/:MemberID?hash=base64hash???

    */
  const AuthGateways = require('../controllers/AuthGateways.js');
  app.route('/api/auth')
    .get(AuthGateways.login);
};