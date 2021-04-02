'use strict';
module.exports = (app) => {
  const MemberList = require('../controllers/memberController');
  app.route('/api/member')
    .get(MemberList.listMembers)
    .post(MemberList.createNewMember);
  app.route('/api/member/:MemberID')
    .get(MemberList.getMemberRecord)
    .put(MemberList.update_a_member)
    .delete(MemberList.delete_a_member);
  app.route('/api/member/:MemberID')
    .get(MemberList.getMemberRecord)
    .put(MemberList.update_a_member)
    .delete(MemberList.delete_a_member);
};