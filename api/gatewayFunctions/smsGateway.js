const phoneFunctions = require("../../Utils/functions/phoneFunctions");

/**
 * Gateway used to ?
 * @param {*} req
 * @param {*} res
 */
exports.sendPhoneCode = async (req, res) => {
  let startTimestamp = new Date().getTime();

  var response = await phoneFunctions
    .sendPhoneCode(req.params.MemberID)
    .catch((err) => {
      console.log("ERR: ", err);
      res.status(codes.Bad_Request);
      return "err";
    });

  if (response == "err") {
    res.status(codes.Bad_Request);
  } else {
    res.status(codes.Ok);
  }
  res.json({ response: response });

  monitoring.log("sendPhoneCode", new Date().getTime() - startTimestamp);
};

/**
 * Gateway used to start the phone number verificaion
 * @param {*} req
 * @param {*} res
 */
exports.verifyPhoneOwnership = async (req, res) => {
  let startTimestamp = new Date().getTime();

  var response = await phoneFunctions
    .setupPhone2FA(req.params.MemberID)
    .catch((err) => {
      console.log("ERR: ", err);
      return "err";
    });

  if (response == "err") {
    res.status(codes.Bad_Request);
  } else {
    res.status(codes.Ok);
  }
  res.json({ response: response });

  monitoring.log("verifyPhoneOwnership", new Date().getTime() - startTimestamp);
};
