const mongoose = require("mongoose");
require("dotenv").config();
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const logging = require("@connibug/js-logging");

var maxBuckets = 5;
var messagesPerBucket = 4;

async function openConnection(url, db) {
  console.log(url, db);
  return new Promise((resolve, reject) => {
    mongoose.createConnection(
      url,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      async function (err, client) {
        if (err) {
          logging.error("Connection to", db, "failed.");
          logging.error(err);
          resolve(false);
        } else {
          // var res = await client.model("Guilds").find({});
          // console.log(res);
          resolve(client);
        }
      }
    );
  });
}

var initDone = false;

let servers = [];

let Server1 = {
  databases: [],
  tables: [],
};

async function getBucket(bucketDB, bucketIndex) {
  var bucket = await bucketDB.collection("bucket_" + bucketIndex);
  return bucket;
}

async function doesBucketExist(bucketDB, bucketIndex) {
  let id = "bucket_" + bucketIndex;
  logging.debug("Checking for bucket: ", id);
  if ((await bucketDB.collection(id).findOne({ exists: true })) == null) {
    logging.debug("Doesnt Exist");
    return false;
  }
  logging.debug("EXISTS");
  return true;
}

async function getMessagesCount(bucketDB, bucketIndex) {
  return await bucketDB.collection("bucket_" + bucketIndex).countDocuments({});
}

// console.log("We are connected! " + host + ":" + port);

// db.collection("stocks", function(error, collection) {
//     console.log("We have a collection"); **
//     var numOfDocs = db.collection('stocks').count();
//     console.log("The num of  Docs in our collection is: ", numOfDocs) **
//         collection.find({ "name": name.toString() }, function(error, cursor) {
//             cursor.toArray(function(error, stocks) {
//                 if(stocks.length == 0) {
//                     //console.log("No Stocks found!");
//                     callback(false);
//                 } else {
//                     callback(stocks[0]);
//                     //console.log("Found a stock -> ",stocks[0]);
//                 }
//             });
//         });

// });

async function initDBs() {
  // let Server1 = {
  //     databases: [],
  //     messageBuckets: [],
  // };

  logging.log("Initiating connection");

  /*
   *   Connect to each database one at a time then push it to the array
   */
  // await openConnection(process.env.mongodb_main);
  mongoose.connect(process.env.mongodb_main, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  logging.log("Connected to main db.");

  // Server1.databases["buckets"] = await openConnection(process.env.mongodb_buckets);
  // logging.log("Connected to buckets db.");

  // logging.log("Finished establishing connections.");

  // for(var i = 1; i <= maxBuckets; ++i) {
  //     var does = await doesBucketExist(Server1.databases["buckets"], i);
  //     console.log(does)
  //     if(!does) break;

  //     var msgCounts = await getMessagesCount(Server1.databases["buckets"], i);
  //     logging.verbose(`bucket ${i} has ${msgCounts} messages within it. max: ${messagesPerBucket}`);
  //     if(msgCounts < messagesPerBucket) {
  //         console.log("Added!.");
  //         Server1.messageBuckets.push(await getBucket(Server1.databases["buckets"], i));
  //     }
  // }

  initDone = true;

  // servers.push({ Server1: Server1 });

  return true;
}

exports.initDBs = async () => {
  return initDBs();
};

exports.get = async () => {
  return new Promise(async (resolve, reject) => {
    while (!initDone) {
      await sleep(500);
    }
    resolve(servers);
  });
};

exports.getServers = () => {
  return servers;
};
