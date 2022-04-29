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

/**Routes Imports */
const AuthRoutes = require("./routes/user.routes");
const EntryRoutes = require("./routes/entry.routes");
const UpdateRoutes = require("./routes/update.routes");

/**Sentry Import */
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

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

/**Sentry Conection Setup */
Sentry.init({
  dsn: "https://0bcdb1c7dc5240fda085a31dead9704b@o1216628.ingest.sentry.io/6358651",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

/**Utilities Setup */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

/**Sentry Handlers */
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(
  Sentry.Handlers.requestHandler({
    serverName: true,
    user: true,
    ip: true,
    transaction: "path",
  })
);
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

/**Ping API Call to check for server health */
app.get("/ping", (req, res) => {
  console.log("client request");
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});
/**API call to debug sentry */
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

/**Main ROutes */
app.use("/user", AuthRoutes);
app.use("/entry", EntryRoutes);
app.use("/updates", UpdateRoutes);

/**Sentry Error handler */
// The error handler must be before any other error middleware and after all controllers
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      //   if (error.status === 404 || error.status === 500) {
      //     return true;
      //   }
      //   return false;
      return true;
    },
  })
);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

/**Server Bootstraping */
app.listen(process.env.PORT, () => {
  console.log("Server started listening on PORT : " + process.env.PORT);
});
