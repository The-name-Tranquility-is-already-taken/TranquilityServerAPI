require("dotenv").config();

var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

var sendingNumber = process.env.TWILIO_SENDING_NUMBER;

var twilio = require("twilio");
var client = new twilio(accountSid, authToken);

module.exports.sendText = async (to_t, body_t) => {
  client.messages
    .create({
      body: body_t,
      to: to_t, // Text this number
      from: sendingNumber, // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
};
