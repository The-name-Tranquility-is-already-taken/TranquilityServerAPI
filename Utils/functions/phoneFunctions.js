/**
 * Within this document do not catch any errors that will be handled by the
 * callers.
 */

const monitoring = require("../monitor");
const mongoose = require("mongoose");
const Members = mongoose.model("Members");
const logging = require("../logging");

//  const hashing = require("../hashing");
//  const SnowflakeFnc = require("../snowflake").GenerateID;
//  const TokenFunc = require("../token");
//  const BCrypt = require(`bcrypt`);
//  const crypto = require("crypto");


// 2FA Codes only last for 3Minutes so we shouldnt have to worry about non-volitile storage
var tmpCodeCache = [{ memberID: 1, code: "ISH", timestamp: 1244444444444444444444444443 }];

/**
 * Generate random 2FA code
 */
module.exports.generate2FA_Code = (MemberID, expiresTime) => {
    console.log("Starting.");
    let currentTimeStamp = new Date().getTime();

    if (expiresTime > currentTimeStamp) logging.log("Valid expiration time passed", "DEBUG");
    else {
        logging.log("Invalid time passed", "ERROR");
        return;
    }
    var unique = true;
    var code = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
    var expiredIndexs = [];
    index = 0;

    // Loop through all currently active 2FA Codes 
    // Look to see if generated code exists if it doesnt return and push it
    // At the same time check if the 2FA Codes are expired or not and if they are push them
    // to an array called expiredIndexs to be removed after the scan is complete
    tmpCodeCache.forEach(e => {
        if (e.timestamp >= currentTimeStamp) {
            console.log("Expired..", e);
            console.log(`Code Timestamp : ${e.timestamp}`);
            console.log(`Cur Timestamp  : ${currentTimeStamp}`);
            console.log(`Time difference: ${e.timestamp - currentTimeStamp}`);
            if (e.timestamp - currentTimeStamp < 0) {
                console.log("Its less than 0???");
            }

            expiredIndexs.push(index);
        }
        if (e.code == code) {
            console.log("Not unique", e);
            unique = false
        }
        ++index;
    });
    //flip the indexs so that as they are removed the indexs dont change
    expiredIndexs.reverse();

    // Remove old records.
    var curIndx = 0;
    var newCodes = [];
    tmpCodeCache.forEach(record => {
        if (!expiredIndexs.includes(curIndx)) {
            newCodes.push(record);
        }
        ++curIndx;
    });
    tmpCodeCache = newCodes;

    // If the 2FA Code was unique then return/push it.
    if (unique) {
        var tmp = {
            memberID: MemberID,
            code: code,
            timestamp: expiresTime
        };
        logging.log("Returning", "DEBUG");
        tmpCodeCache.push(tmp);
        return (tmp);
    }

    // Do the same as the previous code except dont check if the codes re valid
    console.log(tmpCodeCache);
    while (true) {
        var unique = true;
        var code = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);

        tmpCodeCache.forEach(e => {
            if (e.code == code) {
                console.log("Not unique");
                unique = false
            }
        });
        if (unique) {
            var tmp = {
                memberID: MemberID,
                code: code,
                timestamp: expiresTime
            };
            tmpCodeCache.push(tmp);
            return (tmp);
        }
    }
}

var leaseCodeMins = 1;
module.exports.setupPhone2FA = async(MemberID) => {
    // Get the 2FA code that should be used
    let currentTimeStamp = new Date().getTime();
    var expireTime = currentTimeStamp + (leaseCodeMins * 60000);
    var code = this.generate2FA_Code(MemberID, expireTime);

    var user = await Members.find({ id: MemberID });
    user = user[0];

    if (!user) return ("err");

    //sendText(user.phoneNumber, `Your 2FA Code is ${code}`);

    console.log(`Your 2FA Code is ${code}`);
    return (`Your 2FA Code is ${code} expires at timestamp ${expireTime}`);
}

/**
 * Get a list of all members within database.
 * @returns {Array} List of members/status text.
 */
module.exports.getAllMembers = async() => {
    var memberArray = await Members.find({});
    return memberArray;
};

/**
 * Create a new member
 * @param {json} body res.body from http request.
 * @returns {string} status text. Ok/Failed/Already Exists
 */
module.exports.createNewMember = async(body) => {
    var check = await Members.find({ $or: [{ email: body.email }, { tag: body.tag }] });

    check = check[0];

    if (check) {
        if (check.email == body.email) {
            return "email exists";
        } else if (check.tag == body.tag) {
            return "username exists";
        }
    }

    var hashedPassword = hashing.hash(body.password);

    var buildJson = {
        id: SnowflakeFnc(),
        tag: body.tag,
        hash: hashedPassword,
        phoneNumber: body.phoneNumber,
        email: body.email,
    };
    let tmp_NewMember = new Members(buildJson);

    await tmp_NewMember.save();

    return { id: buildJson.id };
};

/**
 * Loging to user account
 * @param {json} body res.body from http request.
 * @returns {string} status text.
 */
module.exports.memberLogin = async(body) => {
    let startTimestamp = new Date().getTime();

    var response = (await Members.find({ email: body.email }))[0];

    monitoring.log("memberLogin - find user from email", (new Date().getTime()) - startTimestamp)

    if (!response) return "Un-Authenticated";

    startTimestamp = new Date().getTime();
    if (BCrypt.compareSync(body.password, response.hash)) {
        monitoring.log("memberLogin - BCrypt.compareSync", (new Date().getTime()) - startTimestamp)

        const secret = crypto.randomBytes(64).toString("hex");

        const token = TokenFunc.createToken(response.id, secret);
        response.tokenSecret = secret;

        startTimestamp = new Date().getTime();
        await Members.findOneAndUpdate({ id: response.id }, response, { new: true, });
        monitoring.log("memberLogin - update db with new tokenSecret", (new Date().getTime()) - startTimestamp);

        return { id: response.id, token: token };
    } else {
        return "Un-Authenticated";
    }
};