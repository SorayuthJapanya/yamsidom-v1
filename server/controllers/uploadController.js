const axios = require("axios");
const Classification = require("../models/classificationModel");
const HistoryClassificationStat = require("../models/historyClassificationModel");
const Species = require("../models/speciesModel");
const fs = require("fs");
const path = require("path");

// Simple in-memory species cache — refreshed every 5 minutes
let _speciesCache = null;
let _speciesCacheAt = 0;
async function getSpeciesMap() {
  if (_speciesCache && Date.now() - _speciesCacheAt < 5 * 60 * 1000) return _speciesCache;
  const speciesData = await Species.find({});
  const map = {};
  speciesData.forEach((s) => { map[s.leafId] = s.localName; });
  _speciesCache = map;
  _speciesCacheAt = Date.now();
  return map;
}

// Single file upload handler
exports.uploadImages = async (req, res) => {
  try {
    const Currentimage = req.file;
    const { isCropped } = req.body;

    // Use authenticated user when available, fall back to body (unauthenticated route)
    const userId = req.user ? req.user._id : req.body.userId;
    const userName = req.user ? req.user.name : req.body.userName;

    const secondLayerMap = await getSpeciesMap();
    const firstLayerMap = {
      A0000: "รูปหัวใจ",
      B0000: "รูปหัวใจขนาดใหญ่",
      C0000: "รูปใบหอก",
      D0000: "รูปรี",
      E0000: "รูปไข่กลับ",
      F0000: "ใบรูปไข่และโคนใบรูปเงียงลูกศร",
      I0000: "ใบรูปไข่และโคนใบรูปเงี่ยงลูกศรแต้มสีม่วง",
    };

    if (!Currentimage)
      return res.status(400).json({ message: "No file uploaded" });

    // File stays on disk — it is the persistent classification image served via /api/v1/uploads/*
    const base64Image = fs.readFileSync(Currentimage.path, { encoding: "base64" });

    const payload = { image: base64Image, isCropped: isCropped };

    const response = await axios.post(`${process.env.ML_URL}/predict`, payload, {
      timeout: 60000, // 60 s — prevents hanging if Flask is overloaded
    });
    const data = response.data;

    const convertFirstLayerSpeciesCode = (speciesCode) => {
      if (typeof speciesCode === "string") {
        return firstLayerMap[speciesCode] || speciesCode;
      }
      return speciesCode; // ถ้าไม่ใช่รหัส หรือเป็นข้อความอื่น
    };

    const bestFirstLayer = convertFirstLayerSpeciesCode(data.best_first_layer);

    const convertSecondLayerSpeciesCode = (speciesCode) => {
      if (typeof speciesCode === "string") {
        return secondLayerMap[speciesCode] || speciesCode; // ถ้าไม่พบใน mapping ให้ใช้รหัสเดิม
      }
      return speciesCode; // ถ้าไม่ใช่รหัส หรือเป็นข้อความอื่น
    };

    let second_layer = [];
    let bestSecondLayer = "";
    let confidenceScore = 0;
    if (typeof data.second_layer !== "string") {
      second_layer = data.second_layer.map((item) => {
        if (Array.isArray(item.prob)) {
          // prob เป็น [className, probValue]
          const [className, probValue] = item.prob;
          return {
            class: convertSecondLayerSpeciesCode(className),
            probability: parseFloat(probValue.toFixed(4)),
          };
        } else {
          // กรณี other = เป็นตัวเลขแล้ว
          return {
            class: item.class,
            probability: parseFloat(item.prob.toFixed(4)),
          };
        }
      });

      if (second_layer.length > 0) {
        bestSecondLayer = second_layer[0].class;
        confidenceScore = second_layer[0].probability;
      }
    } else {
      bestSecondLayer = convertSecondLayerSpeciesCode(data.second_layer);
      confidenceScore = 100;
    }

    const newClassification = new Classification({
      userId,
      userName,
      imageUrl: Currentimage.filename,
      bestFirstLayer: bestFirstLayer,
      secondLayer: second_layer,
      bestSecondLayer: bestSecondLayer,
      confidenceScore: confidenceScore,
      latitude: data.gps?.latitude || "18.796143",
      longitude: data.gps?.longitude || "98.979263",
      datetime_taken: data.datetime_taken || "",
      process_time: data.process_time,
    });

    const totalHistories = await Classification.countDocuments();

    await Promise.all([
      newClassification.save(),
      new HistoryClassificationStat({
        totalHistories,
        updatedAt: new Date(),
      }).save(),
    ]);

    res.status(200).json({
      message: "จำแนกภาพเสร็จสิ้น",
      result: data,
    });
  } catch (error) {
    console.error("Error in uploadImages:", error);
    res.status(500).json({ message: "จำแนกล้มเหลว", error: error.message });
  }
};

// ----------------------------------------------------------------------------------------------
//   OLD MODEL

// // Map probabilities to allpredicted
// const allpredicted = Object.entries(data.all_class_probabilities).map(
//   ([className, prob]) => ({
//     class: convertSpeciesCode(className),
//     probability: parseFloat(prob.toFixed(2)), // ปัดเศษให้สวยงาม
//   })
// );

// const allfilterpredicted = Array.isArray(data.filtered_species_list)
//   ? data.filtered_species_list.map((className) => ({
//       class: convertSpeciesCode(className),
//     }))
//   : [{ class: convertSpeciesCode(data.filtered_species_list) }];

// const top5 = data.top5_predictions.map(([className, prob]) => ({
//   class: convertSpeciesCode(className),
//   probability: parseFloat(prob.toFixed(2)),
// }));

// let bestfilterpredicted;
// if (data.is_filtered) {
//   if (typeof data.filtered_species_list === "string") {
//     // กรณีไม่พบสายพันธุ์ที่ตรงกับ filter
//     bestfilterpredicted = convertSpeciesCode(data.filtered_species_list);
//   } else if (
//     Array.isArray(data.filtered_species_list) &&
//     data.filtered_species_list.length > 0
//   ) {
//     // กรณีพบสายพันธุ์ที่ตรงกับ filter - ใช้ prediction result
//     bestfilterpredicted = convertSpeciesCode(data.filtered_species_list[0]);
//   } else {
//     bestfilterpredicted = "Unknown";
//   }
// } else {
//   bestfilterpredicted = "No filtering applied";
// }

// allpredicted,
// allfilterpredicted,
// top5,
// bestpredicted: convertSpeciesCode(top5[0]?.class) || "Unknown",
// confidenceScore: top5[0]?.probability || 0,
// bestfilterpredicted: bestfilterpredicted || "Unknown",
// // ⚠️ ฟิลด์ใหม่
// is_filtered: data.is_filtered, // บอกว่าใช้ filter หรือไม่
// prediction_confidence: parseFloat(data.prediction.confidence.toFixed(2)), // ความมั่นใจของการทำนายหลัก
// -----------------------------------------------------------------------------------------------------------
