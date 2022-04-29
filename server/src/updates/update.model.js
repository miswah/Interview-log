const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

/**Update Schema for Entries */
const updateSchema = new Schema(
  {
    entry_id: { type: ObjectId, ref: "entries", required: true },
    statusList: { type: String, enum: ["Contacted", "Interview Scheduled", "Next Round", "Rejected", "HR Round", "Got Offer"], require: true },
    lastContactDate: { type: String, require: true },
    remarks: { type: String, required: false },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

/**Assign Schema and set a collection name for mongo */
const Updates = mongoose.model("updates", updateSchema);
module.exports = Updates;
