const jwt = require('jsonwebtoken');

var leaseTime = 60 * 60;


/**
 * 
 * @returns {string} 
*/
module.exports.createToken = (memberID,secret) => {
    return jwt.sign({MemberID: memberID} , secret, { expiresIn: leaseTime });
}
