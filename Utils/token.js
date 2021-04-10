const jwt = require('jsonwebtoken');

var secret = "bdiubsofnmsdpfsm";
var leaseTime = 60 * 60;

module.exports.createToken = (MemberID) => {
    return jwt.sign({userID: MemberID} , secret, { expiresIn: leaseTime });
}
