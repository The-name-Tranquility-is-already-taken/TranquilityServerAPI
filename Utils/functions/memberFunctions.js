/**
 * Within this document do not catch any errors that will be handled by the callers.
*/

const mongoose = require("mongoose");
const Guilds = mongoose.model("Guilds");
const Members = mongoose.model("Members");

const hashing = require("../hashing");
const SnowflakeFnc = require("../snowflake").GenerateID;

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
    var email_check = await Members.find( { email: body.email } );
    var   tag_check = await Members.find( { tag: body.tag } );

    if(email_check.length > 0) {
        return "email exists";
    }
    if(tag_check.length > 0) {
        return "username exists";
    }

    var hashedPassword = hashing.hash(body.password); // TODO

    var buildJson = {
      id: SnowflakeFnc(),
      tag: body.tag,
      hash: hashedPassword,
      phoneNumber: body.phoneNumber,
      email: body.email,
    };
    let tmp_NewMember = new Members(buildJson);
  
    await tmp_NewMember.save();
};

/**
 * Loging to user account
 * @param {json} body res.body from http request.
 * @returns {string} status text.
*/
module.exports.memberLogin = async(body) => {
    var hashedPassword = hashing.hash(body.password); // TODO

    var buildJson = {
      tag: body.tag,
      hash: hashedPassword,
      phoneNumber: body.phoneNumber,
      email: body.email,
    };
    let tmp_NewMember = new Members(buildJson);
    console.log("---------------------");
    console.log("-tmp_NewMember-");
    console.log(tmp_NewMember);
    console.log("---------------------");
  
    await tmp_NewMember.save();
};