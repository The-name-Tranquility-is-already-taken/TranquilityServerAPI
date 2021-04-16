/**
 * Within this document do not catch any errors that will be handled by the
 * callers.
 */

const logging = require("../logging");
const monitoring = require("../monitor");
const mongoose = require("mongoose");
const Members = mongoose.model("Members");

const hashing = require("../hashing");
const SnowflakeFnc = require("../snowflake").GenerateID;
const TokenFunc = require("../token");
const BCrypt = require(`bcrypt`);
const crypto = require("crypto");

/**
 * Get a list of all members within database.
 * @returns {Array} List of members/status text.
 */
module.exports.getAllMembers = async () => {
  var memberArray = await Members.find({});
  return memberArray;
};

/**
 * Create a new member
 * @param {json} body res.body from http request.
 * @returns {string} status text. Ok/Failed/Already Exists
 */
module.exports.createNewMember = async (tag, email, password) => {
  console.log("TAG:", tag, "-password:", password);
  var check = await Members.find({
    $or : [ {email : email}, {tag : tag} ],
  });

  check = check[0];
  console.log(check);

  if (check) {
    if (check.email == email || check.tag == tag) {
      if (check.email == email && check.tag == tag) {
        return "email and tag exists";
      } else {
        if (check.email == email) {
          return "email exists";
        } else if (check.tag == tag) {
          return "username exists";
        }
      }
    }
  }

  var hashedPassword = hashing.hash(password);
  console.log("TESTTTTTTTTTTTTTTTTTTTTTTT");

  var buildJson = {
    id : SnowflakeFnc(),
    tag : tag,
    hash : hashedPassword,
    email : email,
  };
  let tmp_NewMember = new Members(buildJson);

  await tmp_NewMember.save();

  console.log("TESTTTTTTTTTTTTTTTTTTTTTTT");
  return {id : buildJson.id};
};

/**
 * Delete a member based off the member id
 * @param {json} body res.body from http request.
 * @returns {string} status text. Ok/Failed/Already Exists
 */
module.exports.deleteMember = async (MemberID) => {
  var response = await Members.find({id : MemberID}).catch(error => {
    res.send(err);
    logging.log(err, "ERROR", "deleteMember");
    throw ("err");
  });

  if (!response || response[0] == undefined || response == []) {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    logging.log(`[ ${ip} ] - Tried to delete a member that doesnt exist.`);
    throw ("Tried to delete a member that doesnt exist.");
  }

  var deleteResponse = await Members.deleteOne({id : MemberID}).catch(error => {
    logging.log(error, "ERROR", `deleteOne(${{ id: MemberID }})`);
    throw ("err");
  });

  console.log("Delete response:", deleteResponse);

  return "Success.";
};

/**
 * Loging to user account
 * @param {json} body res.body from http request.
 * @returns {string} status text.
 */
module.exports.memberLogin = async (body) => {
  let startTimestamp = new Date().getTime();

  var response = (await Members.find({email : body.email}))[0];

  // monitoring.log(
  //     "memberLogin - find user from email",
  //     new Date().getTime() - startTimestamp
  // );

  if (!response)
    return "Un-Authenticated";

  startTimestamp = new Date().getTime();

  var checkHashAgainstPassword =
      BCrypt.compareSync(body.password, response.hash);

  if (checkHashAgainstPassword) {
    monitoring.log("memberLogin - BCrypt.compareSync",
                   new Date().getTime() - startTimestamp);

    const secret = crypto.randomBytes(64).toString("hex");

    console.log("Secret:", secret);
    const token = TokenFunc.createToken(response.id, secret);
    response.tokenSecret = secret;

    startTimestamp = new Date().getTime();
    await Members.findOneAndUpdate({id : response.id}, response, {
      new : true,
    });
    monitoring.log("memberLogin - update db with new tokenSecret",
                   new Date().getTime() - startTimestamp);

    return {id : response.id, token : token};
  } else {
    return "Un-Authenticated";
  }
};