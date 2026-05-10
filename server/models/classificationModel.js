const mongoose = require("mongoose");

const classificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    // allpredicted: [
    //   {
    //     class: { type: String, required: true },
    //     probability: { type: Number, required: true, min: 0, max: 100 },
    //   },
    // ],
    // allfilterpredicted: [
    //   {
    //     class: { type: String, required: true },
    //   },
    // ],
    secondLayer: [
      {
        class: { type: String, required: true },
        probability: { type: Number, required: true, min: 0, max: 100 },
      },
    ],
    bestFirstLayer: {
      type: String,
      required: true,
    },
    bestSecondLayer: {
      type: String,
      default: "",
    },
    // bestfilterpredicted: {
    //   type: String,
    //   required: true,
    // },
    confidenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    // ⚠️ เพิ่มฟิลด์ใหม่
    // is_filtered: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
    // prediction_confidence: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    //   max: 100,
    //   default: 0,
    // },
    latitude: {
      type: String,
      default: "18.796143",
    },
    longitude: {
      type: String,
      default: "98.979263",
    },
    datetime_taken: {
      type: String,
      default: "",
    },
    process_time: {
      type: Number,
      required: true,
    },
    validate: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "POOR", "FAIR", "GOOD", "EXCELLECT"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classification", classificationSchema);
