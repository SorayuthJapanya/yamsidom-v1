require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Species = require("./models/speciesModel");
const mockupData = require("./mockupdata");

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("🛜 Connected to MongoDB");

    await Species.deleteMany();
    console.log("🧹 Old data cleared");

    const newSpecies = [];

    for (const item of mockupData) {
      newSpecies.push({
        localName: item.localName,
        leafId: item.leafId,
        imageUrl: item.imageFile.split("/").pop(),
        role: item.role
      });

      console.log(`✅ Uploaded: ${item.imageFile.split("/").pop()}`);
      console.log(`✅ Uploaded: ${item.leafId}`);
    }

    await Species.insertMany(newSpecies);
    console.log("🌱 Mock data seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  }
}

seedDatabase();
