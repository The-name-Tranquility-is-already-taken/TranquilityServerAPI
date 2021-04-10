const jwt = require('jsonwebtoken');
const getUserInfo = require("../gatewayFunctions/memberGateway").getMemberInfo;
const logging = require("../../Utils/logging");
const codes = require("../../Utils/error_codes").codes;

async function isTokenValid(userID, submittedToken) {
  var member = await getUserInfo(userID);
  member = member[0];
  if(!member)
    return false;

  memberSecret = member.tokenSecret;
  //logging.log(`Token Validation - userId: ${userID} - MemberSecret: ${memberSecret}`, "GENERIC");

  // Decode submitted token using stored member secret.
  const decodedToken = jwt.verify(submittedToken, memberSecret);
  
  // Get user id from within JSON Token
  const tokenUserID = decodedToken.MemberID;

  if (userID && userID == tokenUserID) {
    return true;
  } else {
    return false;
  }
}

module.exports.authWrapper = async (req, res, next) => {
  if(!req.headers.authorization) {
    res.status(codes.Unauthorized).json({
      error: 'Un-Authorised!'
    });
    return;
  }
  const submittedToken = req.headers.authorization.split(' ')[1];
  console.log(submittedToken);
  var valid = await isTokenValid(req.params.MemberID, submittedToken);
  console.log(`Token Valid: ${valid}`);
  if(valid) {
    next();
  }else {
    res.status(codes.Unauthorized).json({
      error: 'Un-Authorised!'
    });
  }
  return valid;
  /*
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
  */

};