require("dotenv").config();

const mongoose = require("mongoose");
const monitoring = require("./Utils/monitor");
const path = require("path");
const logging = require("@connibug/js-logging");
logging.setupMail("mail.spookiebois.club", 587, process.env.EMAIL, process.env.EMAIL_PASS);
const express = require("express");
const app = express();



const port = process.env.PORT || 3000;

// const hashing = require("./Utils/hashing");

// if(!process.env.saltRounds) {
//   hashing.setup();
// }

monitoring.output();

async function start() {
  logging.log("--------------------------------------------------");
  logging.log("Starting.");
  logging.log("--------------------------------------------------");
  require("./Databases/DBs").initDBs();
  const servers = await require("./Databases/DBs").get();

  console.log("=========================");
  console.log("Servers");
  servers.forEach(e => {
    var ServerName = Object.keys(e)[0];
    console.log("|", ServerName, "- Databases:", undefined);
  });
  console.log("=========================");

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
