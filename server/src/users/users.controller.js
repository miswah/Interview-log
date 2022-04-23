/**Setup Imports */
const Joi = require("joi");
require("dotenv").config();
const { v4: uuid } = require("uuid");

/**Import helpers */
const { generateJwt } = require("./helpers/generateJwt");

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
    const hash = await User.hashPassword(result.value.password);
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
