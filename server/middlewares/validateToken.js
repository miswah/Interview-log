const jwt = require("jsonwebtoken");
require("dotenv").config();

/**Model import */
const User = require("../src/users/users.model");

//Function Decalaration

module.exports = async (req, res, next) => {
  try {
    //Get token from header
    const authorizationHeader = req.headers.authorization;

    //Check if token exists else throw error
    if (!authorizationHeader)
      return res.status(401).json({
        error: true,
        message: "Access token is missing",
      });

    // Split the token from bearer part or whatever comes before " "
    const token = req.headers.authorization.split(" ")[2]; // Bearer <token>

    //Fetch the token from DB
    const user = await User.findOne({ accessToken: token }, "accessToken userId -_id");

    //check if Token exists else end request and send error
    if (!user) {
      return res.status(403).json({
        error: true,
        message: `Authorization error`,
      });
    }

    //Verify the token parse from header
    const result = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: "365y" });

    //Check if the userId matches for both user fetched from db and the user id of parsed Token
    if (!user.userId === result.id) {
      return res.status(401).json({
        error: true,
        message: `Invalid token`,
      });
    }

    //Assigin the decoded data into req.decoded
    req.decoded = result;
    next();
  } catch (error) {
    console.error("token-validation-error", error);
    if (err.name === "TokenExpiredError") {
      result = {
        error: true,
        message: `TokenExpired`,
      };
    } else {
      result = {
        error: true,
        message: `Authentication error`,
      };
    }
    return res.status(403).json(result);
  }
};
