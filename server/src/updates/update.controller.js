/**Setup Imports */
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
/**Model Import */
const Update = require("../updates/update.model");

/**Schema Validation */
const UpdateSchema = Joi.object().keys({
  entry_id: Joi.string().required(),
  statusList: Joi.string().valid("Contacted", "Interview Scheduled", "Next Round", "Rejected", "HR Round", "Got Offer"),
  lastContactDate: Joi.string().required(),
  remarks: Joi.string(),
});

/**Create New Update Function */
exports.Create = async (req, res) => {
  try {
    //Check if entryId is valid
    if (!mongoose.Types.ObjectId.isValid(req.body.entry_id)) {
      return res.json({
        error: true,
        status: 400,
        message: "Invalid object id",
      });
    }

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

    //Send Data
    return res.json({
      error: false,
      status: 200,
      message: "Update Add Succefully",
    });
  } catch (error) {
    console.error("Update-creation-error", error);
    return res.status(500).json({
      error: true,
      message: "Could not save new update",
    });
  }
};

/**function Update List function */
exports.All = async (req, res) => {
  try {
    //Assign entry id to variable
    const entryId = req.params.entry_id;

    //check if the entity id exists
    if (!entryId) {
      return res.json({
        error: false,
        status: 404,
        message: "entry Id doesn't exists",
      });
    }

    //Check if entryId is valid
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return res.json({
        error: true,
        status: 400,
        message: "Invalid object id",
      });
    }

    //Fetch all the updates from DB for this entry
    const update = await Update.find({ entry_id: entryId });

    //Send Data
    return res.json({
      error: false,
      status: 200,
      message: update,
    });
  } catch (error) {
    console.error("Update-All-error", error);
    return res.status(500).json({
      error: true,
      message: "Could not fetch list of update",
    });
  }
};
