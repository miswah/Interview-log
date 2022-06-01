const sanitize = require("mongo-sanitize");

module.exports = (req, res, next) => {
  try {
    req.body = sanitize(req.body);
    next();
  } catch (error) {
    console.error("sanitize-body-error", error);
    return res.status(500).json({
      error: true,
      message: "Couldn't sanitize body of request",
    });
  }
};
