/**Setup Imports */
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
/**Model Import */
const Update = require("../updates/update.model");

/**Schema Validation */
const UpdateSchema = Joi.object().keys({
  entry_id: Joi.objectId(),
  statusList: Joi.string().valid("Contacted", "Interview Scheduled", "Next Round", "Rejected", "HR Round", "Got Offer"),
  lastContactDate: Joi.string().required(),
  remarks: Joi.string(),
});

/**Create New Update Function */
exports.Create = async (req, res) => {
  try {
    //Assign userId to req body
    req.body.userId = req.decoded.userId;

    //check for request body validation
    const result = UpdateSchema.validate(req.body);

    //Throw error if validation fails
    if (result.error) {
      console.log("Update Create request body validation error", result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    //Save the fresh update entry
    const newUpdate = new Update(result.value);
    await newUpdate.save();
  } catch (error) {
    console.error("Update-creation-error", error);
    return res.status(500).json({
      error: true,
      message: "Could not save new update",
    });
  }
};
