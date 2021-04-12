/**
 * Within this document do not catch any errors that will be handled by the
 * callers.
 */

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
module.exports.createNewMember = async (body) => {
  var check =
      await Members.find({$or : [ {email : body.email}, {tag : body.tag} ]});

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
    id : SnowflakeFnc(),
    tag : body.tag,
    hash : hashedPassword,
    phoneNumber : body.phoneNumber,
    email : body.email,
  };
  let tmp_NewMember = new Members(buildJson);

  await tmp_NewMember.save();

  return {id : buildJson.id};
};

/**
 * Loging to user account
 * @param {json} body res.body from http request.
 * @returns {string} status text.
 */
module.exports.memberLogin = async (body) => {
  let startTimestamp = new Date().getTime();

  var response = (await Members.find({email : body.email}))[0];

  monitoring.log("memberLogin - find user from email",
                 (new Date().getTime()) - startTimestamp)

  if (!response) return "Un-Authenticated";

  startTimestamp = new Date().getTime();
  if (BCrypt.compareSync(body.password, response.hash)) {
    monitoring.log("memberLogin - BCrypt.compareSync",
                   (new Date().getTime()) - startTimestamp)

    const secret = crypto.randomBytes(64).toString("hex");

    const token = TokenFunc.createToken(response.id, secret);
    response.tokenSecret = secret;

    startTimestamp = new Date().getTime();
    await Members.findOneAndUpdate({id : response.id}, response, {
      new : true,
    });
    monitoring.log("memberLogin - update db with new tokenSecret",
                   (new Date().getTime()) - startTimestamp);

    return {id : response.id, token : token};
  } else {
    return "Un-Authenticated";
  }
};
