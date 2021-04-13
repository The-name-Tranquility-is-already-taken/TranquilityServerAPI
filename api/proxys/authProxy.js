const jwt = require("jsonwebtoken");
const getUserInfo = require("../gatewayFunctions/memberGateway").getMemberInfo;
const logging = require("../../Utils/logging");
const codes = require("../../Utils/error_codes").codes;
const monitoring = require("../../Utils/monitor");

async function isTokenValid(userID, submittedToken) {
  let startTimestamp = new Date().getTime();

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
      monitoring.log("isTokenValid - valid",
                     new Date().getTime() - startTimestamp);
      return true;
    } else {
      monitoring.log("isTokenValid - invalid",
                     new Date().getTime() - startTimestamp);
      return false;
    }
  } catch (err) {
    logging.log(err, "ERROR");
    monitoring.log("isTokenValid - error",
                   new Date().getTime() - startTimestamp);
    return false;
  }
}

module.exports.authWrapper = async (req, res, next) => {
  let startTimestamp = new Date().getTime();

  if (!req.headers.authorization) {
    res.status(codes.Unauthorized).json({error : "Un-Authorised!"});
    monitoring.log("authWrapper - failed to pass headers",
                   new Date().getTime() - startTimestamp);
    return;
  }
  const submittedToken = req.headers.authorization.split(" ")[1];

  var valid = await isTokenValid(req.params.MemberID, submittedToken);
  if (valid) {
    monitoring.log("authWrapper - valid",
                   new Date().getTime() - startTimestamp);
    next();
  } else {
    monitoring.log("authWrapper - invalid token",
                   new Date().getTime() - startTimestamp);
    res.status(codes.Unauthorized).json({error : "Un-Authorised!"});
  }
  return valid;
};
