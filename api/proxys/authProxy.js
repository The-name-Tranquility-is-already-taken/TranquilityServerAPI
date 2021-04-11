const jwt = require('jsonwebtoken');
const getUserInfo = require("../gatewayFunctions/memberGateway").getMemberInfo;
const logging = require("../../Utils/logging");
const codes = require("../../Utils/error_codes").codes;

async function isTokenValid(userID, submittedToken) {
  var member = await getUserInfo(userID);
  member = member[0];
  if (!member)
    return false;

  memberSecret = member.tokenSecret;
  // logging.log(`Token Validation - userId: ${userID} - MemberSecret:
  // ${memberSecret}`, "GENERIC");

  // Decode submitted token using stored member secret.
  try {
    const decodedToken = jwt.verify(submittedToken, memberSecret);

    // Get user id from within JSON Token
    const tokenUserID = decodedToken.MemberID;

    if (userID && userID == tokenUserID) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    logging.log(err, "GENERIC");
    return false;
  }
}

module.exports.authWrapper = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(codes.Unauthorized).json({error : 'Un-Authorised!'});
    return;
  }
  const submittedToken = req.headers.authorization.split(' ')[1];

  var valid = await isTokenValid(req.params.MemberID, submittedToken);
  if (valid) {
    next();
  } else {
    res.status(codes.Unauthorized).json({error : 'Un-Authorised!'});
  }
  return valid;
};