const jwt = require("jsonwebtoken");
require("dotenv").config();

//set options for jwt
const options = {
  expiresIn: "365y", //temp will move in production
};

/**Generate JWT and return the token */
async function generateJWT(email, userId, name) {
  try {
    const payload = { email: email, userId: userId, name: name };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, options);
    return { error: false, token: token };
  } catch (error) {
    return { error: true, context: error };
  }
}

module.exports = { generateJWT };
