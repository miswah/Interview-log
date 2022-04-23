/**Express import */
const express = require("express");
const app = express();

/**Mongoose Setup */
const mongoose = require("mongoose");

/**Utility Imports */
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

/**Mongooes Conection Setup */
mongoose
  .connect(process.env.MONGO_URI, { dbName: "InterviewLog", useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch((err) => {
    console.log(process.env.MONGO_URI);
    console.log("Mongo Connection Error", err);
  });

/**Utilities Setup */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

/**Ping API Call to check for server health */
app.get("/ping", (req, res) => {
  console.log("client request");
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});

/**Server Bootstraping */
app.listen(process.env.PORT, () => {
  console.log("Server started listening on PORT : " + process.env.PORT);
});
