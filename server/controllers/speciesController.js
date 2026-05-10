const Species = require("../models/speciesModel");
const fs = require("fs");
const path = require("path");

exports.addSpecie = async (req, res) => {
  try {
    const { name } = req.user;
    const currentImage = req.file;
    const {
      commonName,
      localName,
      scientificName,
      familyName,
      description,
      propagation,
      plantingseason,
      harvestingseason,
      utilization,
      status,
      surveysite,
    } = req.body;

    if (!currentImage) {
      return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพใบไม้" });
    }

    if (!commonName || !localName || !scientificName || !familyName || !description) {
      return res
        .status(400)
        .json({ message: "กรุณากรอกข้อมูลที่สำคัญให้ครบถ้วน" });
    }

    // Check if scientificName already exists
    const existingSpecie = await Species.findOne({ scientificName });
    if (existingSpecie) {
      return res.status(400).json({
        message: "มีสายพันธุ์ที่ใช้ชื่อวิทยาศาสตร์นี้อยู่แล้ว",
      });
    }

    const newSpecies = new Species({
      imageUrl: currentImage.filename,
      userName: name,
      commonName,
      localName,
      scientificName,
      familyName,
      description,
      propagation,
      plantingseason,
      harvestingseason,
      utilization,
      status,
      surveysite,
    });

    const savedSpecies = await newSpecies.save();

    res.status(200).json({
      message: "เพิ่มข้อมูลสายพันธุ์เสร็จสิ้น",
      specie: savedSpecies,
    });
  } catch (error) {
    console.log("Error in addSpecies controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllSpeciesByQuery = async (req, res) => {
  try {
    const { local_Name = "", limit = 10, role = "" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (page - 1) * parsedLimit;

    // สร้าง query object
    const query = {};
    if (local_Name) {
      query.localName = { $regex: local_Name, $options: "i" };
    }
    let species = [];
    let totalSpecies = 0;

    if (role === "ADMIN") {
      // สำหรับ ADMIN ให้แสดงแบบ pagination
      species = await Species.find(query)
        .skip(skip)
        .limit(parsedLimit)
        .sort({ createdAt: -1 });

      totalSpecies = await Species.countDocuments(query);
    } else {
      // สำหรับ user ทั่วไป ให้แสดงทั้งหมด (หรือตามต้องการ)
      species = await Species.find(query).sort({ leafcreatedAtId: -1 });
      totalSpecies = species.length;
    }

    // ส่ง response กลับ
    res.status(200).json({
      success: true,
      totalSpecies,
      totalPages: Math.ceil(totalSpecies / parsedLimit),
      currentPage: page, // แก้ไขจาก currentPages เป็น currentPage
      limit: parsedLimit,
      species,
    });
  } catch (error) {
    console.error("Error in getAllSpeciesByQuery controller:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getAllSpecies = async (req, res) => {
  try {
    const species = await Species.find().sort({ createdAt: -1 });

    res.status(200).json({
      species,
    });
  } catch (error) {
    console.log("Error in getAllSpecies controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getOneSpecie = async (req, res) => {
  try {
    const { _id } = req.params;

    const specie = await Species.findById(_id);
    if (!specie) {
      return res.status(404).json({ message: "This specie not found" });
    }

    res.status(200).json(specie);
  } catch (error) {
    console.log("Error in getOneSpecie controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateSpecie = async (req, res) => {
  try {
    const { _id } = req.params;
    const currentImage = req.file;
    const {
      commonName,
      localName,
      scientificName,
      familyName,
      description,
      propagation,
      plantingseason,
      harvestingseason,
      utilization,
      status,
      surveysite,
    } = req.body;

    const specie = await Species.findById(_id);
    if (!specie)
      return res.status(404).json({ message: "This specie not found" });

    // Provided Data
    if (commonName) specie.commonName = commonName;
    if (localName) specie.localName = localName;
    if (scientificName) specie.scientificName = scientificName;
    if (familyName) specie.familyName = familyName;
    if (description) specie.description = description;
    if (propagation) specie.propagation = propagation;
    if (plantingseason) specie.plantingseason = plantingseason;
    if (harvestingseason) specie.harvestingseason = harvestingseason;
    if (utilization) specie.utilization = utilization;
    if (status) specie.status = status;
    if (surveysite) specie.surveysite = surveysite;

    if (currentImage) {
      // Delete the old image file if it exists
      if (specie.imageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "../uploads/species",
          specie.imageUrl
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old image file:", err);
          }
        });
      }

      // Update the imageUrl field with the new image
      specie.imageUrl = currentImage.filename;
    }
    const updatedSpecie = await specie.save();

    res
      .status(200)
      .json({ message: "Specie updated successfully", specie: updatedSpecie });
  } catch (error) {
    console.log("Error in updateSpecie controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteSpecie = async (req, res) => {
  try {
    const { _id } = req.params;

    const specie = await Species.findByIdAndDelete(_id);
    if (!specie)
      return res.status(404).json({ message: "This specie not found" });

    if (specie.imageUrl) {
      const imagePath = path.join(__dirname, "../uploads/species", specie.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting species image:", err);
      });
    }

    res.status(200).json({ message: "Specie deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSpecie controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.searchSpecies = async (req, res) => {
  try {
    const { scientific_Name = "" } = req.query;

    const query = {};
    if (scientific_Name) {
      query.scientificName = { $regex: scientific_Name, $options: "i" };
    }

    const data = await Species.find(query);

    res.status(200).json(data);
  } catch (error) {
    console.log("Error in searchSpecies controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
