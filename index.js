const jwt = require('jsonwebtoken');

//       JSON Payload    Secret       Expiration Date
console.log(jwt.sign({userID: "1"} , "CUCK", { expiresIn: 60 * 60 }));

const sendMail = require("./Utils/functions/mailer").sendMail;
// sendMail("conni@spookiebois.club", "SUPPPPP");

const logging = require("./Utils/logging");

require("dotenv").config();

const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require("mongoose");

const uri = process.env.mongodb;
require("./api/models/MemberModel"); // created model loading here
require("./api/models/GuildModel"); // created model loading here

// mongoose instance connection url connection
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    logging.log("DB Connected!");
  })
  .catch((err) => {
    console.log(Error, "Failed to connect to DB\nErrror :" + err.message);
    logging.log(err ,"ERROR");
  });

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
