// Import_DB
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });

    const existimgEmail = await User.findOne({ email });
    if (existimgEmail)
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });

    const existingName = await User.findOne({ name });
    if (existingName)
      return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "รหัสผ่านไม่ตรงกัน" });

    if (password.length < 6)
      return res.status(400).json({ message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({
        message: "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่และตัวเลขอย่างน้อยอย่างละหนึ่งตัว",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Role is always USER on self-signup — admins promote users via admin panel
    const user = new User({
      name,
      email,
      role: "USER",
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ", user });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    // Create & send token
    const token = jwt.sign(
      { userID: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await res.cookie("jwt-yamleaves", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.ALLOWED_HTTPS === "true",
    });

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.log("Error in logged in controller!!", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt-yamleaves");
  res.json({ message: "ออกจากระบบเสร็จสิ้น" });
};

exports.getCurrentUser = (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error in getCurrentUser controller");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { _id } = req.params;

    const user = await User.findById(_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUser controller", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

exports.getAllClient = async (req, res) => {
  try {
    const { name = "", limit = 10 } = req.query;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Build the query
    const query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    // Find all users
    const users = await User.find(query)
      .select("-password ")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();
    const totalRoleUser = await User.countDocuments({ role: "USER" });
    const totalRoleAdmin = await User.countDocuments({ role: "ADMIN" });

    const response = {
      totalUsers,
      totalRoleUser,
      totalRoleAdmin,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      limit,
      users,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("Error in getAllUsers controller", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const profilePic = req.file;
    const {
      name,
      email,
      role,
      position,
      department,
      organization,
      work_address,
      phone_number,
    } = req.body;

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });

    if (name) user.name = name;
    if (email) user.email = email;
    // Only admins may change roles
    if (role && req.user.role === "ADMIN") user.role = role;
    if (position) user.position = position;
    if (department) user.department = department;
    if (organization) user.organization = organization;
    if (work_address) user.work_address = work_address;

    if (phone_number) {
      const digits = phone_number.replace(/\D/g, "");
      if (digits.length === 10) {
        user.phone_number = digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      } else {
        user.phone_number = phone_number;
      }
    }

    if (profilePic) {
      if (user.profilePic) {
        const oldProfilePath = path.join(
          __dirname,
          "../uploads",
          user.profilePic
        );
        fs.unlink(oldProfilePath, (err) => {
          if (err) {
            console.error("Error deleting old image file:", err);
          }
        });
      }

      user.profilePic = profilePic.filename;
    }

    // Save the Updates User
    const updateUser = await user.save();

    const { password: _, ...userWithoutPassword } = updateUser._doc;

    res
      .status(200)
      .json({
        message: "อัปเดตข้อมูลผู้ใช้เสร็จสิ้น",
        user: userWithoutPassword,
      });
  } catch (error) {
    console.log("Error on updateUser controller!!", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { _id } = req.params;
    const profilePic = req.file;

    if (!profilePic)
      return res.status(404).json({ message: "กรุณากรอกรูปภาพของท่าน" });

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });

    if (profilePic) {
      // Delete the old image if it exists
      if (user.profilePic) {
        const oldImagePath = path.resolve(
          __dirname,
          "../uploads",
          user.profilePic
        );
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (err) => {
              if (err) console.error("Error deleting old image:", err);
            });
          }
        });
      }

      // Save new filename
      user.profilePic = profilePic.filename;
    }

    await user.save();

    res.status(200).json({ message: "อัปเดตรูปโปรไฟล์เสร็จสิ้น" });
  } catch (error) {
    console.log("Error on updateProfile controller!!", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { _id } = req.params;

    // Check role ADMIN
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only Admin can delete" });
    }

    // Check And Delete User
    const user = await User.findByIdAndDelete(_id);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });

    res.status(200).json({ message: "ลบผู้ใช้งานเสร็จสิ้น" });
  } catch (error) {
    console.log("Error on searchUser controller!!", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { name = "", page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    if (!name.trim()) {
      return res
        .status(400)
        .json({ message: "กรุณากรอกชื่อผู้ใช่ที่ต้องการหา" });
    }

    const query = {
      name: { $regex: name, $options: "i" },
    };

    const [users, totalUsers] = await Promise.all([
      User.find(query).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error on searchUser controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
