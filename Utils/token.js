const jwt = require("jsonwebtoken");

// done in seconds = 30 days
const leaseTime = 60 * 60 * 24 * 30;

/**
 *
 * @returns {string}
 */
module.exports.createToken = (memberID, secret) => {
  var signed = jwt.sign({MemberID : memberID}, secret, {
    expiresIn : leaseTime,
  });
  return signed;
};