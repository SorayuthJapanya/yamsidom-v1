const mongoose = require("mongoose");

const speciesSchema = mongoose.Schema(
  {
    imageUrl: {
      type: String,
    },
    userName: {
      type: String,
      // required: true,
    },
    leafId: {
      type: String,
      // unique: true,
    },
    role: {
      type: String,
      default: "NEW",
      enum: ["NEW", "OLD"],
    },
    commonName: {
      type: String,
      // required: true,
    },
    localName: {
      type: String,
      // required: true,
    },
    scientificName: {
      type: String,
      // required: true,
    },
    familyName: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    propagation: {
      type: String,
    },
    plantingseason: {
      type: String,
    },
    harvestingseason: {
      type: String,
    },
    utilization: {
      type: String,
    },
    status: {
      type: String,
    },
    surveysite: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Species", speciesSchema);
