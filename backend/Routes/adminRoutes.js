const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const adminAuth = require("../middleware/adminAuth");
const adminModel = require("../Database/adminModel");
const projectModel = require("../Database/projectModel");
const teacherModel = require("../Database/teacherModel");

const ADMIN_TOKEN_KEY = "nvsknv;GHAHATHP5{}|)(*#$%578923";
const ADMIN_FORGOT_PASSWORD_KEY = "fklasjbhflBKASBVLK&@$^23513^@#^$&";
const ADMIN_REGISTER_KEY =
  "AdminFSKLJGHSLnskvns;vuifg$%#&#&!)(*%&";
// Registration

const registrationSchema = joi.object({
  name: joi.string().min(3).max(100).required(),

  email: joi.string().email().required(),
  secreteKey: joi.string().required(),
  //   mobile: joi.number().min(1000000000).required(),
  password: joi
    .string()
    .min(8)
    .max(50)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

const registration = async (req, res) => {
  // console("Checking admin credentials for registration");

  const { error } = await registrationSchema.validate({
    name: req.body.name,
    email: req.body.email,
    // mobile: req.body.mobile,
    password: req.body.password,
    secreteKey: req.body.secreteKey,
  });

  if (error) {
    // console("error in joi");
    // console(error);
    return res.send({ status: "failed", msg: error.details[0].message });
  }

  if (ADMIN_REGISTER_KEY !== req.body.secreteKey) {
    // console("invalid secrete key");
    return res.send({
      status: "failed",
      msg: "Please provide valid Secrete Key",
    });
  }
  let admin;
  try {
    admin = await adminModel.findOne({ email: req.body.email });
    if (admin) {
      // console("admin already exists");
      return res.send({ status: "failed", msg: "admin already exists" });
    }
  } catch (error) {
    // console("error while finding admin");
    return res.send({ status: "failed", msg: "Server error has occurred" });
  }

  let salt;
  try {
    salt = await bcrypt.genSalt(20);
  } catch (error) {
    // console("error in bcrypt");
    return res.send({
      status: "failed",
      msg: "server error while generating salt",
    });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, salt);
  } catch (error) {
    // console("error while hashing password");
  }
  admin = new adminModel({
    name: req.body.name,
    email: req.body.email,
    // mobile: req.body.mobile,
    position: "admin",
    password: hashedPassword,
    pic: req.file ? req.file.filename : "dummy image 4.png",
  });

  admin.save((err) => {
    if (err) {
      // console("err while saving admin");
      return res.send({
        status: "failed",
        msg: "server error while saving admin",
      });
    }
    // console("admin saved successfully");
    return res.send({ status: "success", msg: "admin saved successfully" });
  });
};

// login

const login = async (req, res) => {
  // console("checking admins for login");
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  const { error } = await loginSchema.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (error) return res.send({ status: "failed", msg: "Provide valid data" });

  let admin;
  try {
    admin = await adminModel.findOne({ email: req.body.email });
    if (!admin) {
      // console("admin does not exists");
      return res.send({ status: "failed", msg: "admin does not exists" });
    }
  } catch (error) {
    // console("error while getting admin");
    return res.send({ status: "failed", msg: "server error" });
  }

  let isValid = false;
  try {
    isValid = await bcrypt.compare(req.body.password, admin.password);
  } catch (error) {
    // console("error while validating password");
    return res.send({ status: "failed", msg: "server error" });
  }

  if (isValid) {
    const token = await jwt.sign({ adminId: admin._id }, ADMIN_TOKEN_KEY, {
      expiresIn: "1d",
    });
    // console("login successful");
    res.cookie("token", token, { maxAge: 86400000 });
    res.cookie("user", admin, { maxAge: 86400000 });
    // res.cookie('a',"10")

    res.send({ status: "success", msg: "Login successful", token, admin });
  } else {
    // console("password is wrong");
    return res.send({
      status: "failed",
      msg: "Email or Password is incorrect",
    });
  }
};

// admin edit profile
const editAdminProfile = async (req, res) => {
  // console("in editing profile function");
  const editProfileSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    newEmail: joi.string().email().required(),
    currentEmail: joi.string().email().required(),
  });
  const { error } = editProfileSchema.validate({
    name: req.body.name,
    newEmail: req.body.newEmail,
    currentEmail: req.body.currentEmail,
  });

  if (error) {
    // console("error in joi");
    return res.send({ status: "failed", msg: "Please Provide valid data" });
  }

  if (req.body.newEmail !== req.body.currentEmail) {
    try {
      const userExists = await adminModel.findOne({
        email: req.body.newEmail,
      });
      if (userExists) {
        // console("email has already taken");
        return res.send({ status: "failed", msg: "Email has already taken" });
      }
    } catch (error) {
      // console("error while finding user");
      return res.send({ status: "failed", msg: "Please provide valid email" });
    }
  }

  try {
    var find = await adminModel.findOne({_id: req.admin._doc._id})
    if(!find) {
      // console("not found");
      return res.send({status : "failed", msg : "Something went wrong."})
    }
  } catch (error) {
    // console("error wifskanl ////");
    // console(error);
      return res.send({status : "failed", msg : "Something went wrong."})
  }

  try {
    const result = await adminModel.findOneAndUpdate(
      { email: req.body.currentEmail },
      {
        $set: {
          name: req.body.name,
          email: req.body.newEmail,
          pic: req.body.pic
            ? req.body.pic
            : find.pic,
        },
      },
      { new: true }
    );
    if (result) {
      const token = await jwt.sign({ adminId: result._id }, ADMIN_TOKEN_KEY, {
        expiresIn: "1d",
      });
      // console("login successful");
      res.cookie("token", token, { maxAge: 86400000 });
      res.cookie("user", result, { maxAge: 86400000 });
      // res.clearCookie("student", { path: "/" });
      // res.clearCookie("token", { path: "/" });
      // res.clearCookie("teacher", { path: "/" });
      // res.clearCookie("teacherToken", { path: "/" });
      res.send({
        status: "success",
        msg: "updating is successful",
        admin: result,
      });
      // console("changes saved");
    } else {
      res.send({ msg: "Unable to save changes. Try again later" });
      // console("error while saving changes", result);
    }
  } catch (error) {
    // console("error ************************");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Something went wrong. Try again.",
    });
  }
};

// Search Project Queries

const search = async (req, res) => {
  // console("In admin search part");

  // console("query is ", req.query);

  if (!req.query.teacherId) {
    // console("teacher is not selected");
    return res.send({ status: "failed", msg: "Teacher is not selected" });
  }
  if (
    req.query.year &&
    req.query.div &&
    req.query.subject &&
    req.query.sem &&
    req.query.studentYear &&
    req.query.branch
  ) {
    var result;
    try {
      result = await projectModel
        .find({
          year: parseInt(req.query.year),
          sem: parseInt(req.query.sem),
          subject: req.query.subject,
          isApproved: req.query.status === "true" ? true : false,
          isApprovedByAdmin: req.query.adminApproved === "true" ? true : false,
          projectHead: req.query.teacherId,
          studentYear: req.query.studentYear,
          div: req.query.div,
          branch: req.query.branch,
        })
        .populate("students")
        .populate("marks.studentId");

      if (result.length > 0) {
        // console("result found");
        // console(result);
        return res.send({ status: "success", result });
      }
      return res.send({ status: "failed", msg: "No result found" });
    } catch (error) {
      // console("error has occurred*************");
      // console(error);
      return res.send({ status: "failed", msg: "Server Error" });
    }
  } else {
    // console("parameters are not valid");
    return res.send({
      status: "failed",
      msg: "Please provide valid parameters",
    });
  }
};

// GET ALL TEACHERS DATA.
const getAllTeachers = async (req, res) => {
  // console("In get all teacher");
  try {
    const findAdmin = await adminModel.findOne({
      _id: req.admin._doc._id,
      position: "admin",
    });
    if (!findAdmin) {
      // console("admin not found");
      return res.send({ status: "failed", msg: "You are not an admin" });
    }
  } catch (error) {
    // console("error while finding admin");
    return res.send({ status: "failed", msg: "Invalid Admin Id." });
  }

  try {
    const data = await teacherModel.find();
    // console("data is ");
    // console(data);
    return res.send({ status: "success", allTeachers: data });
  } catch (error) {
    // console("error while getting teachers");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Unable to get the teachers data.",
    });
  }
};

// approve project
const approveProject = async (req, res) => {
  // console("In approve project part");
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Couldn't find the project",
      });
    }
  } catch (error) {
    // console("invalid project id");
    return res.send({
      status: "failed",
      msg: "Provided project is invalid, Try again later.",
    });
  }
  const project = await projectModel.findOneAndUpdate(
    { _id: req.body.projectId },
    {
      $set: {
        isApprovedByAdmin: true,
      },
    },
    { new: true }
  );
  if (!project) {
    // console("Unable to update project status");
    return res.send({
      status: "failed",
      msg: "Server Error. Unable to update project status",
    });
  }

  // console("project added");
  return res.send({ status: "success", msg: "Project updated" });
};

// ADD PROJECT REMARK
const addRemark = async (req, res) => {
  // console("In add remark");

  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Project Id is invalid",
      });
    }
  } catch (error) {
    // console("invalid project id");
    return res.send({
      status: "failed",
      msg: "Server Error. Project Id is invalid.",
    });
  }

  try {
    const project = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId },
      {
        $set: {
          adminRemark: req.body.remark,
        },
      },
      { new: true }
    );

    if (!project) {
      // console("error while updating project");
      return res.send({
        status: "failed",
        msg: "Server Error, Can not add comment",
      });
    }
    // console("remark added");
    return res.send({ status: "success" });
  } catch (error) {
    // console("error while find Student");
    return res.send({ status: "failed", msg: "Can not add remark. Try again" });
  }
};

const changePassword = async (req, res) => {
  // console("In change password");
  if (!req.body.originalPassword || !req.body.newPassword) {
    // console("invalid parameters");
    return res.send({
      status: "failed",
      msg: "Please provide all the required parameters ",
    });
  }

  try {
    var admin = await adminModel.findOne({ _id: req.admin._doc._id });
    if (!admin) {
      // console("student not found");
      return res.send({
        status: "failed",
        msg: "Student not found. Please try again or try again after the login",
      });
    }
  } catch (error) {
    // console("error 1");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Invalid Student. login again to continue",
    });
  }
  const check = bcrypt.compare(req.body.originalPassword, admin.password);
  if (!check) {
    // console("original password is wrong");
    return res.send({ status: "failed", msg: "Provided password is wrong" });
  }
  let salt;
  try {
    salt = await bcrypt.genSalt(20);
  } catch (error) {
    // console("error in bcrypt");
    return res.send({
      status: "failed",
      msg: "server error while generating salt",
    });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
  } catch (error) {
    // console("error while hashing password");
  }
  try {
    const admin = await adminModel.findOneAndUpdate(
      { _id: req.admin._doc._id },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (!admin) {
      // console("unable to save student");
      return res.send({
        status: "failed",
        msg: "Failed to save the password. Try again",
      });
    }
    // console("password saved");

    // console("admin is ", admin);
    return res.send({ status: "success" });
  } catch (error) {
    // console("unable to find student");
    return res.send({
      status: "failed",
      msg: "Server Error. Failed to save the password. Try again",
    });
  }
};

const forgetPassword = async (req, res) => {
  // console("in forgot pass");

  if (!req.body.email || !req.body.password || !req.body.key) {
    // console("please provide all the parameters");
    return res.send({
      status: "failed",
      msg: "please provide all the parameters",
    });
  }

  if (req.body.key !== ADMIN_FORGOT_PASSWORD_KEY) {
    // console("wrong key");
    return res.send({ status: "failed", msg: "Key is invalid" });
  }

  try {
    const admin = await adminModel.findOne({ email: req.body.email });
    if (!admin) {
      // console("admin not found");
      return res.send({ status: "failed", msg: "Email is invalid" });
    }
  } catch (error) {
    // console("error email");
    // console(error);
    return res.send({ status: "failed", msg: "Email is invalid" });
  }
  let salt;
  try {
    salt = await bcrypt.genSalt(20);
  } catch (error) {
    // console("error in bcrypt");
    return res.send({
      status: "failed",
      msg: "server error while generating salt",
    });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, salt);
  } catch (error) {
    // console("error while hashing password");
  }
  try {
    const admin = await adminModel.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (!admin) {
      // console("unable to save student");
      return res.send({
        status: "failed",
        msg: "Failed to save the password. Try again",
      });
    }
    // console("password saved");

    // console("admin is ", admin);
    return res.send({ status: "success" });
  } catch (error) {
    // console("unable to find student");
    return res.send({
      status: "failed",
      msg: "Server Error. Failed to save the password. Try again",
    });
  }
};

// logout

const logout = (req, res) => {
  // console("in logout");
  res.clearCookie("user");
  res.clearCookie("token");
  return res.send({ status: "success" });
};

router.post("/register", registration);
router.post("/login", login);
router.patch("/edit-profile", adminAuth, editAdminProfile);
router.patch("/change-password", adminAuth, changePassword);
router.get("/logout", adminAuth, logout);
router.patch("/forget-password", forgetPassword);

router.get("/get-all-teachers", adminAuth, getAllTeachers);
router.patch("/add-remark", adminAuth, addRemark);
router.get("/get-all-projects", adminAuth, search);
router.patch("/approve-project", adminAuth, approveProject);

module.exports = router;
