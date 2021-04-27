const monitoring = require("./Utils/monitor");
// const hashing = require("./Utils/hashing");
const path = require("path");

// if(!process.env.saltRounds) {
//   hashing.setup();
// }

monitoring.output();

const sendText = require("./Utils/functions/texter").sendText;
sendText("+447434731840", "PP");
// const sendMail = require("./Utils/functions/mailer").sendMail;
// sendMail("conni@spookiebois.club", "SUPPPPP");

const logging = require("./Utils/logging");
logging.log("--------------------------------------------------");
logging.log("Starting.");
logging.log("--------------------------------------------------");

require("dotenv").config();

const express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require("mongoose");

const uri = process.env.mongodb;
require("./api/models/MemberModel"); // created model loading here
require("./api/models/GuildModel"); // created model loading here

// mongoose instance connection url connection
let startTimestamp = new Date().getTime();
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then((res) => {
        logging.log("DB Connected!");
        monitoring.log("generic - DB Connected", new Date().getTime() - startTimestamp);
    })
    .catch((err) => {
        console.log(Error, "Failed to connect to DB\nErrror :" + err.message);
        logging.log(err, "ERROR");
        monitoring.log(
            "generic - DB Connection failed",
            new Date().getTime() - startTimestamp
        );
        process.exit(1);
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