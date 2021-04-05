const jwt = require('jsonwebtoken');
const getUserInfo = require("../gatewayFunctions/memberGateway").getMemberInfo;
const logging = require("../../Utils/logging");

var users = [
  {
    userID: 1,
    tokenSecret: "CUCK"
  }
];

async function isTokenValid(userID, submittedToken) {
  var member = await getUserInfo(userID);
  member = member[0];

  memberSecret = member.tokenSecret;
  logging.log(`Token Validation - userId: ${userID} - MemberSecret: ${memberSecret}`, "GENERIC");

  // Decode submitted token using stored member secret.
  const decodedToken = jwt.verify(submittedToken, memberSecret);

  // Get user id from within JSON Token
  const tokenUserID = decodedToken.userId;

  if (userID && userID == tokenUserID) {
    return true;
  } else {
    return false;
  }
}

module.exports.authWrapper = (req, res, next) => {
  if(!req.headers.authorization) {
    res.status(401).json({
      error: 'UnAuthorised!'
    });
    return;
  }
  const submittedToken = req.headers.authorization.split(' ')[1];

  console.log(`Token Valid: ${isTokenValid(req.params.MemberID, submittedToken)}`);
  try {
    var tokenSecret = users[0].tokenSecret;


    // Decode token using stored secret.
    const decodedToken = jwt.verify(submittedToken, tokenSecret);

    // Get user id from within JSON Token
    const userId = decodedToken.userId;

    // Validate the decoded token has the same ID of the body id.
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};