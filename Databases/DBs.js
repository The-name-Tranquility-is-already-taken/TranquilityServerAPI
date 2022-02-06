const mongoose = require("mongoose");
require("dotenv").config();
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const logging = require("@connibug/js-logging");
// logging.setupMail("mail.spookiebois.club", 587, process.env.EMAIL, process.env.EMAIL_PASS);

var maxBuckets = 5;
var messagesPerBucket = 4;

async function openConnection(url, db) {
  return new Promise((resolve, reject) => {
    mongoose.createConnection(
      url,
      {
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        poolSize: 10, // Can run 10 operations at a time
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
  var bucketName = "bucket_" + bucketIndex;
  var flags = { exists: true };
  if ((await bucketDB.collection(bucketName).findOne(flags)) == null) {
    return false;
  }
  return true;
}

async function getMessagesCount(bucketDB, bucketIndex) {
  return (
    (await bucketDB.collection("bucket_" + bucketIndex).countDocuments({})) - 1
  );
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
  let Server1 = {
    databases: [],
    messageBuckets: [],
  };

  logging.log("Initiating dbs");

  /*
   *   Connect to each database one at a time then push it to the array
   */
  Server1.databases["main"] = await openConnection(process.env.mongodb_main);
  if (Server1.databases["main"] == false) {
    logging.error("Error connecting to main db.");
  } else {
    logging.log("Connected to main db.");
  }

  Server1.databases["buckets"] = await openConnection(
    process.env.mongodb_buckets
  );
  if (Server1.databases["buckets"] == false) {
    logging.error("Error connecting to buckets db.");
  } else {
    logging.log("Connected to buckets db.");
  }

  logging.log("Finished establishing connections.");

  for (var i = 1; i <= maxBuckets; ++i) {
    var does = await doesBucketExist(Server1.databases["buckets"], i);
    if (!does) break;

    var msgCounts = await getMessagesCount(Server1.databases["buckets"], i);
    logging.verbose(
      `bucket ${i} has ${msgCounts} messages within it. max: ${messagesPerBucket}`
    );
    if (msgCounts < messagesPerBucket) {
      logging.log(`Added bucket number ${i} to the bucket table!.`);
      Server1.messageBuckets.push(
        await getBucket(Server1.databases["buckets"], i)
      );
    }
  }

  initDone = true;

  servers.push({ Server1: Server1 });

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
