const mongoose = require("mongoose");
const monitoring = require("./Utils/monitor");
const path = require("path");
const logging = require("./Utils/logging");
const express = require("express");
const app = express();

require("dotenv").config();

const port = process.env.PORT || 3000;

// const hashing = require("./Utils/hashing");

// if(!process.env.saltRounds) {
//   hashing.setup();
// }

monitoring.output();

// mongoose instance connection url connection
// let startTimestamp = new Date().getTime();
// mongoose
//     .connect(uri_main, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//     })
//     .then((res) => {
//         logging.log("uri_main Connected!");
//         monitoring.log("mongodb_main - DB Connected", new Date().getTime() - startTimestamp);
//     })
//     .catch((err) => {
//         console.log(Error, "Failed to connect to mongodb_main DB\nErrror :" + err.message);
//         logging.log(err, "ERROR");
//         monitoring.log(
//             "mongodb_main - DB Connection failed",
//             new Date().getTime() - startTimestamp
//         );
//         process.exit(1);
//     });

// mongoose
//     .connect(uri_buckets, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//     })
//     .then((res) => {
//         logging.log("uri_buckets Connected!");
//         monitoring.log("uri_buckets - DB Connected", new Date().getTime() - startTimestamp);
//     })
//     .catch((err) => {
//         console.log(Error, "Failed to connect to uri_buckets DB\nErrror :" + err.message);
//         logging.log(err, "ERROR");
//         monitoring.log(
//             "uri_buckets - DB Connection failed",
//             new Date().getTime() - startTimestamp
//         );
//         process.exit(1);
//     });
async function start() {
  logging.log("--------------------------------------------------");
  logging.log("Starting.");
  logging.log("--------------------------------------------------");
  require("./Databases/DBs").initDBs();
  const servers = await require("./Databases/DBs").get();

  console.log("SERVERS", servers);
  require("./api/models/MemberModel"); // created model loading here
  require("./api/models/GuildModel"); // created model loading here
  require("./api/models/BucketModel"); // created model loading here

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const routes = require("./api/routes/routes");
  routes(app); // register the routes

  app.get("*", (req, res) => {
    logging.log(req.originalUrl + " not found");
    res.status(404).send({ url: req.originalUrl + " not found" });
  });

  app.listen(port);
  logging.log("Server RESTful API server started on: " + port);
}

start();
