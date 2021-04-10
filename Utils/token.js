const jwt = require('jsonwebtoken');

var secret = "bdiubsofnmsdpfsm";
var leaseTime = 60 * 60;


/**
 * 
 * @returns {string} 
*/
module.exports.createToken = (MemberID) => {
    return jwt.sign({MemberID: MemberID} , secret, { expiresIn: leaseTime });
}
