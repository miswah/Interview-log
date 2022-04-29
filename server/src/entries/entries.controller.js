/**Setup Imports */
const Joi = require("joi");

/**Model Import */
const Entry = require("../entries/entries.model");

/**Schema Validation */
const EntrySchema = Joi.object().keys({
  userId: Joi.string().required(),
  companyName: Joi.string().required(),
  positionName: Joi.string().required(),
  postLink: Joi.string().required(),
  salaryRange: Joi.string(),
  location: Joi.string().required(),
  contact: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      mobileNo: Joi.number(),
      email: Joi.string().email({ minDomainSegment: 2 }),
    })
  ),
  salaryRange: Joi.string().required(),
  dateOfApplication: Joi.string().required(),
  remarks: Joi.string(),
});

/**Create New Entry Function */
exports.Create = async (req, res) => {
  try {
    //Assign userId to req body
    req.body.userId = req.decoded.userId;

    //check for request body valdiation
    const result = EntrySchema.validate(req.body);

    //throw error if validation fails
    if (result.error) {
      console.log("Entry Create request body validation error", result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    //Check if the Entry for the same already exists
    const entry = await Entry.findOne({ userId: result.value.userId, companyName: result.value.companyName, dateOfApplication: result.value.dateOfApplication, positionName: result.value.positionName });

    //Throw error if the same entry for same day exists
    if (entry) {
      return res.json({
        error: true,
        status: 400,
        message: "Entry for this job postion already exists",
      });
    }

    //Save the fresh entry
    const newEntry = new Entry(result.value);
    await newEntry.save();

    return res.json({
      error: false,
      status: 200,
      message: "New Entry Added",
    });
  } catch (error) {
    console.error("Entry-creation-error", error);
    return res.status(500).json({
      error: true,
      message: "Could not save new entry",
    });
  }
};