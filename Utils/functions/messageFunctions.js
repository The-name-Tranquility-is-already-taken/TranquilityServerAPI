const servers = require("./../../Databases/DBs").getServers();

const mongoose = require("mongoose");
const Members = servers[0].Server1.databases.main.model("Members");
const Guilds = servers[0].Server1.databases.main.model("Guilds");
const Buckets = mongoose.model("Buckets");

const guildSnowflake = require("../snowflake").GenerateID;
const logging = require("../logging");
const limits = require("./limits");

function getCurrentBucket() {
  function getStock(name, callback) {
    var db = new mongo.Db("Buckets", new mongo.Server(host, port, {}));
    db.open(function (error) {
      console.log("We are connected! " + host + ":" + port);

      db.collection("stocks", function (error, collection) {
        // console.log("We have a collection"); **
        // var numOfDocs = db.collection('stocks').count() **
        //     **
        //     console.log("The num of  Docs in our collection is: ", numOfDocs) **
        //     collection.find({ "name": name.toString() }, function(error, cursor) {
        //         cursor.toArray(function(error, stocks) {
        //             if(stocks.length == 0) {
        //                 //console.log("No Stocks found!");
        //                 callback(false);
        //             } else {
        //                 callback(stocks[0]);
        //                 //console.log("Found a stock -> ",stocks[0]);
        //             }
        //         });
        //     });
      });
    });
  }
}

/**
 * Creates a new channel in the specific guild
 * @param {string} MessageContent The message text
 * @param {string} SenderID ID of the user that sent the message
 * @param {string} RecipicantID Either channel id or DM User ID
 * @param {string} GuilidID Only if message was sent in channel
 * @returns {string} Status text.
 */
module.exports.sendMessage = async (
  MessageContent,
  SenderID,
  RecipicantID,
  GuilidID = "N/A"
) => {
  var cleanedMessageTextRes = limits.messageText(MessageContent);

  if (cleanedMessageTextRes.modified) {
    logging.log(
      "Parsed message text isnt valid. TODO: Handle this for the client.",
      "WARNING"
    );
    console.log(cleanedMessageTextRes);
    MessageContent = cleanedMessageTextRes.cleaned;
  }

  var builtJSON = {};
  if (GuilidID != "N/A") {
    // Guild message

    builtJSON = {
      id: guildSnowflake(false),
      messageType: "channel",
      content: MessageContent,
      authorID: SenderID,

      channelID: RecipicantID,
      guildID: GuilidID,
    };
  } else {
    // DM Message

    builtJSON = {
      id: guildSnowflake(false),
      messageType: "DMs",
      content: MessageContent,
      authorID: SenderID,

      recipicantID: RecipicantID,
    };
  }

  console.log("Recieved message:", builtJSON);

  // PERMS CHECK WOULD GO HERE.
s


  // // Create channel in db.
  // var res = await Guilds.findOneAndUpdate({ id: GuilidID }, { $push: { channels: builtJSON } });
  // if(res == null) {
  //     throw "Guild Doesnt Exist"
  // }

  return builtJSON;
};
