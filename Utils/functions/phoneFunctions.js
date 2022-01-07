/**
 * Within this document do not catch any errors that will be handled by the
 * callers.
 */
const servers = require("./../../Databases/DBs").getServers();

const mongoose = require("mongoose");
const Verifications = mongoose.connection.model("Verifications");
const logging = require("@connibug/js-logging");
const {
  SamplePage,
} = require("twilio/lib/rest/autopilot/v1/assistant/task/sample");

//  const hashing = require("../hashing");
//  const SnowflakeFnc = require("../snowflake").GenerateID;
//  const TokenFunc = require("../token");
//  const BCrypt = require(`bcrypt`);
//  const crypto = require("crypto");

function Sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var expiredIndexs = [];

// 2FA Codes only last for 3Minutes so we shouldnt have to worry about
// non-volitile storage
var tmpCodeCache = [
  { memberID: 1, code: "ISH", timestamp: 12, phonenumber: 07423235 },
];

function doesCodeExistInCache(
  checkCode,
  currentTimeStamp = new Date().getTime()
) {
  var index = 0;
  var inCache = false;
  tmpCodeCache.forEach((e) => {
    var timeDiff = e.timestamp - currentTimeStamp;
    console.log("Time left of code", e.code, "-", timeDiff);
    if (timeDiff <= 0) {
      // Debugging.
      // console.log("---------------------------------------");
      // console.log("Expired..", e);
      // console.log(`Code Timestamp : ${e.timestamp}`);
      // console.log(`Cur Timestamp  : ${currentTimeStamp}`);
      // console.log(`Time difference: ${timeDiff}`);
      // console.log("---------------------------------------");

      expiredIndexs.push(index);
    }
    if (e.code == checkCode) {
      // console.log("Code already in cache");
      inCache = true;
    }
    // else {
    //     console.log("Code", e.code, "doesnt match", checkCode);
    // }
  });
  return inCache;
}


/**
 * Create a new member
 * @param {json} body res.body from http request.
 * @returns {string} status text. Ok/Failed/Already Exists
 */
 module.exports.sendPhoneCode = async (tag, phoneNumber, password) => {
  if(debugMemberFuncs) logging.debug("Request to create user with tag: <" + tag + "> and password: <" + password + ">");
  var check = await Verifications.find({
    $or: [{ email: email }, { tag: tag }],
  });

  check = check[0];
  if (check) {
    if(debugMemberFuncs) {
      logging.debug("Existing data found: " + JSON.stringify(check));
    }
    if (check.email == email || check.tag == tag) {
      if (check.email == email && check.tag == tag) {
        if(debugMemberFuncs) logging.debug("Email and Tag are matching.");
        return "email and tag exists";
      } else {
        if (check.email == email) {
          if(debugMemberFuncs) logging.debug("email is matching.");
          return "email exists";
        } else if (check.tag == tag) {
          if(debugMemberFuncs) logging.debug("username is matching.");
          return "username exists";
        }
      }
    }
  }

  var hashedPassword = hashing.hash(password);
  if(debugMemberFuncs) logging.debug("hashed password: " + hashedPassword);

  var buildJson = {
    id: SnowflakeFnc(),
    tag: tag,
    hash: hashedPassword,
    email: email,
  };
  let tmp_NewMember = new Members(buildJson);

  await tmp_NewMember.save();

  if(debugMemberFuncs) logging.debug("New account created with id: " + buildJson.id);
  return { id: buildJson.id };
};

function genCode(currentTimeStamp = new Date().getTime()) {
  var code = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
  console.log("Auth Code:", code);
  var failed = false;
  var attempts = 0;
  while (doesCodeExistInCache(code, currentTimeStamp)) {
    ++attempts;
    if (attempts > 10) {
      failed = true;
      break;
    }
    Sleep(100);
    code = "o"; // Math.random().toString(36).substring(2, 5) +
    // Math.random().toString(36).substring(2, 5);
  }
  if (failed) {
    throw "Failed to generate unique Codes.";
  }
  return code;
}

/**
 * Generate random 2FA code
 */
module.exports.generate2FA_Code = (MemberID, expiresTime, PhoneNumber) => {
  let currentTimeStamp = new Date().getTime();

  if (expiresTime < currentTimeStamp) {
    throw "Invalid time passed";
  }

  // Generate a unique code, or handle the error
  var code = genCode(currentTimeStamp);
  if (code == "N/A") {
    throw "Failed.";
  }

  // flip the indexs so that as they are removed the indexs dont change
  expiredIndexs.reverse();

  // Remove old records.
  var curIndx = 0;
  var newCodes = [];
  tmpCodeCache.forEach((record) => {
    if (!expiredIndexs.includes(curIndx)) {
      newCodes.push(record);
    }
    ++curIndx;
  });
  tmpCodeCache = newCodes;

  // If the 2FA Code was unique then return/push it.
  var tmp = {
    memberID: MemberID,
    code: code,
    timestamp: expiresTime,
    phonenumber: PhoneNumber,
  };
  tmpCodeCache.push(tmp);
  return tmp;
};

var leaseCodeMins = 1;
module.exports.setupPhone2FA = async (MemberID, PhoneNumber) => {
  // Get the 2FA code that should be used
  let currentTimeStamp = new Date().getTime();
  var expireTime = currentTimeStamp + leaseCodeMins * 60000;

  var code = this.generate2FA_Code(MemberID, expireTime, PhoneNumber);

  sendText(PhoneNumber, `Your 2FA Code is ${code}`);

  console.log(`Your 2FA Code is ${code.code}`);
  return `Your 2FA Code is ${code.code} expires at timestamp ${expireTime}`;
};
