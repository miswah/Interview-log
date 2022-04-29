const mongooes = require("mongooes");
const Schema = mongooes.Schema;

/**Entity Schema for Interview Entries */

const entitySchema = new Schema(
  {
    userId: { type: String, require: true },
    companyName: { type: String, require: true },
    positionName: { type: String, require: true },
    postLink: { type: String, require: true },
    salaryRange: { type: String, require: false },
    location: { type: String, require: true },
    contact: { type: String, require: false },
    status: { type: String, require: true, default: "New" },
    dateOfApplication: { type: String, require: true },
    remarks: { type: String, require: false },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

/**Assign Schema and set a collection name for mongo */
const Entry = mongooes.model("entries", entitySchema);
module.exports = Entry;
