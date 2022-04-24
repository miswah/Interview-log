/**Setup Imports */
const Joi = require("joi");
require("dotenv").config();
const { v4: uuid } = require("uuid");

/**Import helpers */
const { generateJWT } = require("./helpers/generateJwt");

/**Model import */
const User = require("./users.model");

/**Schema Validation */
const UserSchema = Joi.object().keys({
  email: Joi.string().required().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(5),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  name: Joi.string().required().min(2),
});

/**Sign up Function */
exports.Signup = async (req, res) => {
  try {
    //Check for request body validation
    const result = UserSchema.validate(req.body);

    //throw error if validation fails
    if (result.error) {
      console.log("Signup request body validation error", result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    //Check if the email has already been used
    const user = await User.findOne({ email: result.value.email });

    //Thorw Error if email already registered
    if (user) {
      return res.json({
        error: true,
        message: "Looks like you're already in our system!",
      });
    }

    //Hash the password
    const hash = await User.hashPassword(result.value.password.toLowerCase());
    result.value.password = hash; // set hashed password to result variable
    //Delete confirmPassword value
    delete result.value.confirmPassword;

    //Generate unique id for user
    const id = uuid();
    result.value.userId = id; //set the generated id to result variable

    //Generate Code for email OTP
    let code = Math.floor(100000 + Math.random() * 900000);
    let expiry = Date.now() + 60 * 1000 * 15; //15 mins in ms
    //set value of email otp and email expires to result varible
    result.value.emailToken = code;
    result.value.emailTokenExpires = new Date(expiry);

    // Make the Call to save into DB the result variable
    const newUser = new User(result.value);
    await newUser.save();

    return res.status(200).json({
      error: false,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot register",
    });
  }
};

/**Login Fuction */
exports.Login = async (req, res) => {
  try {
    //set email and password to lowecase
    const email = req.body.email.toLowerCase();
    const password = req.body.password.toLowerCase();

    // check and throw error if email or password doesn't exits
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }

    //1. Find if any account with that email exists in DB
    const user = await User.findOne({ email: email });

    // NOT FOUND - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Looks like we don’t have your email in our system!",
      });
    }

    //2. Throw error if account is not activated
    if (!user.active) {
      return res.status(400).json({
        error: true,
        message: "User is blocked please contact Administration", //Replace this message if email otp is enable
      });
    }

    //3. Verify the password is valid
    const isValid = await User.comparePasswords(password, user.password);
    // Throw error if password doesn't match
    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Looks like that password doesn’t match!",
      });
    }

    // Fetch Token from the DB
    const lastToken = await User.findOne({ email: req.body.email }, "accessToken -_id");

    //4. Check if token exists
    if (lastToken && lastToken.length > 1) {
      return res.send({
        success: true,
        message: "User logged in successfully",
        accessToken: lastToken.accessToken,
      });
    }

    //Generate Access token
    const { error, token, context } = await generateJWT(user.email, user.userId, user.name);

    //throw error if token doesn't exists
    if (error) {
      console.error("Access-token-generation-error", context);
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }

    //If Token Doesnt Exists save the token in DB
    user.accessToken = token;
    await user.save();
    return res.send({
      success: true,
      message: "Token Generated",
      accessToken: token,
    });
  } catch (error) {
    console.error("login-error", error);
    return res.status(500).json({
      error: true,
      message: "Login Error",
    });
  }
};
