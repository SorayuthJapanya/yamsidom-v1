const fs = require("fs");
const path = require("path");
const Species = require("../models/speciesModel");

async function getFolderInfo(folderPath) {
  let totalSize = 0;
  let fileCount = 0;
  const files = await fs.promises.readdir(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isFile()) {
      totalSize += stats.size;
      fileCount++;
    } else if (stats.isDirectory()) {
      const subInfo = await getFolderInfo(filePath);
      totalSize += subInfo.size;
      fileCount += subInfo.fileCount;
    }
  }

  return { size: totalSize, fileCount };
}

exports.getFolderName = async (req, res) => {
  try {
    const { folderName } = req.query;

    const dirPath = path.join(__dirname, "../uploads/gallery");
    const items = await fs.promises.readdir(dirPath);

    const folders = [];

    for (const item of items) {
      const folderPath = path.join(dirPath, item);
      const stats = await fs.promises.stat(folderPath);

      if (stats.isDirectory()) {
        if (folderName) {
          if (!item.toLowerCase().startsWith(folderName.toLowerCase())) {
            continue; // ข้ามถ้าไม่ตรง
          }
        }

        const { size, fileCount } = await getFolderInfo(folderPath);

        folders.push({
          name: item,
          sizeMB: (size / (1024 * 1024)).toFixed(2) + " Mb",
          fileCount: fileCount,
        });
      }
    }
    res.json({
      folders: folders,
      folderCount: folders.length,
    });
  } catch (error) {
    console.error("Error in getFolderName controller:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

exports.getImagesByFolder = async (req, res) => {
  try {
    const { folder = "", limit = "" || 20 } = req.query;
    const page = parseInt(1)
    const start = (page - 1) * limit;
    const end = page * limit;

    if (!folder) {
      return res.status(400).json({
        error: "กรุณาระบุชื่อโฟลเดอร์",
      });
    }

    const dirPath = path.join(__dirname, "../uploads/gallery", folder);

    fs.readdir(dirPath, (err, files) => {
      if (err) {
        console.error("ไม่สามารถอ่านโฟลเดอร์:", err);
        return res.status(500).json({ error: "ไม่สามารถอ่านโฟลเดอร์ได้" });
      }

      const imageFiles = files.filter(
        (file) => /\.(jpg|jpeg|png|gif)$/i.test(file) && !file.startsWith("._")
      );

      const total = imageFiles.length;
      const paginatedFiles = imageFiles.slice(start, end);

      res.json({
        limit: limit,
        total,
        data: paginatedFiles,
      });
    });
  } catch (error) {
    console.error("Error in getImagesByFolder controller:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

exports.createGalleryFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const isSpecies = await Species.findOne({ localName: folderName });

    if (!isSpecies) {
      return res
        .status(401)
        .json({ message: "กรุณากรอกชื่อโฟลเดอร์ให้ตรงกับชื่อสายพันธุ์" });
    }

    const dirPath = path.join(__dirname, "../uploads/gallery", folderName);

    fs.mkdir(dirPath, (err) => {
      if (err) {
        if (err.code === "EEXIST") {
          return res.status(400).json({ message: "ชื่อโฟลเดอร์นี้มีอยู่แล้ว" });
        } else {
          return res.status(400).json({ message: "มีบางอย่างผิดพลาด" });
        }
      } else {
        res.status(200).json({ message: "สร้างโฟลเดอร์สำเร็จแล้ว" });
      }
    });
  } catch (error) {
    console.error("Error in addImagesToGallery controller:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

exports.addImagesToGallery = async (req, res) => {
  try {
    res.status(200).json({ message: "เพิ่มรูปภาพเสร็จสิ้น" });
  } catch (error) {
    console.error("Error in addImagesToGallery controller:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const { folderName } = req.body;

    if (!folderName)
      return res.status(400).json({ message: "ไม่พบโฟลเดอร์ที่ทำรายการ" });

    const dirPath = path.join(__dirname, "../uploads/gallery", folderName);

    if (!fs.existsSync(dirPath)) {
      return res.status(404).json({ message: "ไม่พบโฟลเดอร์ที่ทำรายการ" });
    }

    fs.rm(dirPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("ลบโฟลเดอร์ไม่สำเร็จ:", err);
        return res.status(500).json({ message: "ลบโฟลเดอร์ไม่สำเร็จ" });
      }
      return res.status(200).json({ message: "ลบโฟลเดอร์สำเร็จ" });
    });
  } catch (error) {
    console.error("Error in deleteImageInGallery controller:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { folderName, fileName } = req.body;
    if (!folderName) {
      return res
        .status(400)
        .json({ message: "กรุณาเลือกโฟลเดอร์ที่ท่านจะทำรายการ" });
    }
    if (!fileName) {
      return res
        .status(400)
        .json({ message: "กรุณาเลือกรูปภาพที่ท่านจะทำรายการ" });
    }

    const dirPath = path.join(__dirname, "../uploads/gallery", folderName);

    if (!fs.existsSync(dirPath)) {
      return res.status(404).json({ message: "ไม่พบโฟลเดอร์ที่ทำรายการ" });
    }

    const filePath = path.join(
      __dirname,
      "../uploads/gallery",
      folderName,
      fileName
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ message: "ลบรูปภาพสำเร็จ" });
    } else {
      return res.status(404).json({ message: "ไม่พบรูปภาพที่ท่านทำรายการ" });
    }
  } catch (error) {
    console.error("Error in deleteImage controller:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};
