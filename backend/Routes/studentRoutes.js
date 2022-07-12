const express = require("express");
const router = express.Router();
const studentModel = require("../Database/studentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const studentAuth = require("../middleware/studentAuth");
const STUDENT_TOKEN_KEY = "alksnfkjasbvialfhKALGAILGHSAK%@#%#!%#@^$*&(%523522";
// Registration

const registrationSchema = joi.object({
  name: joi.string().min(3).max(100).required(),
  rollNo: joi.number().required(),
  email: joi.string().email().required(),
  div: joi.string().required(),
  password: joi
    .string()
    .min(8)
    .max(50)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  currentEmail: joi.string().email(),
  year: joi.string().required(),
  branch: joi.string().required(),
});

const registration = async (req, res) => {
  // console("Checking student credentials for registration");
  // console(req.body);
  const { error } = await registrationSchema.validate({
    name: req.body.name,
    rollNo: req.body.rollNo,
    email: req.body.email,
    div: req.body.div,
    password: req.body.password,
    branch: req.body.branch,
    year: req.body.year,
  });

  if (error) {
    // console("error in joi");
    // console(error);
    return res.send({ status: "failed", msg: error.details[0].message });
  }

  let student;
  try {
    student = await studentModel.findOne({ email: req.body.email });
    if (student) {
      // console("student already exists");
      return res.send({ status: "failed", msg: "student already exists" });
    }
  } catch (error) {
    // console("error while finding student");
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
  student = new studentModel({
    name: req.body.name,
    email: req.body.email,
    rollNo: req.body.rollNo,
    mobile: req.body.mobile,
    password: hashedPassword,
    div: req.body.div,
    grNo: req.body.grNO,
    year: req.body.year,
    branch: req.body.branch,
  });

  student.save((err) => {
    if (err) {
      // console("err while saving student");
      // console(err);
      return res.send({
        status: "failed",
        msg: "server error while saving student",
      });
    }
    // console("student saved successfully");
    return res.send({ status: "success", msg: "Student saved successfully" });
  });
};

// login

const login = async (req, res) => {
  // console("checking credentials for login");
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  const { error } = await loginSchema.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (error) return res.send({ status: "failed", msg: "Provide valid data" });

  let student;
  try {
    student = await studentModel.findOne({ email: req.body.email });
    if (!student) {
      // console("student does not exists");
      return res.send({ status: "failed", msg: "Student does not exists" });
    }
  } catch (error) {
    // console("error while getting student");
    return res.send({ status: "failed", msg: "server error" });
  }

  let isValid = false;
  try {
    isValid = bcrypt.compare(req.body.password, student.password);
  } catch (error) {
    // console("error while validating password");
    return res.send({ status: "failed", msg: "server error" });
  }

  if (isValid) {
    const token = await jwt.sign({ studentId: student._id }, STUDENT_TOKEN_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      maxAge: 86400000,
      httpOnly: false,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    res.cookie("user", student, {
      maxAge: 86400000,
      httpOnly: false,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    // res.clearCookie('teacher', {path:"/"})
    // res.clearCookie('teacherToken', {path:"/"})
    // res.clearCookie('admin', {path:"/"})
    // res.clearCookie('adminToken', {path:"/"})
    // res.cookie("a", "20")
    // console("login successful");
    res.send({ status: "success", msg: "Login successful", token, student });
  } else {
    // console("password is wrong");
    return res.send({
      status: "failed",
      msg: "Email or Password is incorrect",
    });
  }
};

// edit profile

const editUser = async (req, res) => {
  // console("in editing profile function");
  // console("body is ");
  // console(req.body);
  const editProfileSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    rollNo: joi.number().required(),
    div: joi.string().required(),

    currentEmail: joi.string().email(),
    year: joi.string().required(),
    branch: joi.string().required(),
  });
  const { error } = editProfileSchema.validate({
    name: req.body.name,
    rollNo: req.body.rollNo,
    div: req.body.div,
    currentEmail: req.body.currentEmail,
    year: req.body.year,
    branch: req.body.branch,
  });

  if (error) {
    // console("error in joi");
    // console(error);
    return res.send({ status: "failed", msg: "Please Provide valid data" });
  }

  if (req.body.newEmail !== req.body.currentEmail) {
    try {
      const userExists = await studentModel.findOne({
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
    var find = await studentModel.findOne({ _id: req.student._doc._id });
    if (!find) {
      // console("not found");
      return res.send({ status: "failed", msg: "Something went wrong." });
    }
  } catch (error) {
    // console("error wifskanl ////");
    // console(error);
    return res.send({ status: "failed", msg: "Something went wrong." });
  }

  try {
    const result = await studentModel.findOneAndUpdate(
      { email: req.body.currentEmail },
      {
        $set: {
          name: req.body.name,
          email: req.body.newEmail,
          mobile: req.body.mobile,
          div: req.body.div,
          rollNo: req.body.rollNo,
          grNo: req.body.grNo,
          year: req.body.year,
          branch: req.body.branch,
          pic: req.body.pic ? req.body.pic : find.pic,
        },
      },
      { new: true }
    );
    // console("updated stuent is ", result);
    if (result) {
      const token = await jwt.sign({ studentId: result._id }, STUDENT_TOKEN_KEY, {
        expiresIn: "1d",
      });
      res.cookie("token", token, { maxAge: 86400000 });
      res.cookie("user", result, { maxAge: 86400000 });
      // console("changes saved");
      return res.send({
        status: "success",
        msg: "updating is successful",
        student: result,
      });
    } else {
      res.send({ msg: "error has occurred while saving. Try again later" });
      // console("error while saving changes", result);
    }
  } catch (error) {
    // console("error while updating");
    return res.send({ status: "failed", msg: "failed to update the profile" });
  }
};

// change password
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
    var student = await studentModel.findOne({ _id: req.student._doc._id });
    if (!student) {
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
  const check = bcrypt.compare(req.body.originalPassword, student.password);
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
    const student = await studentModel.findOneAndUpdate(
      { _id: req.student._doc._id },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (!student) {
      // console("unable to save student");
      return res.send({
        status: "failed",
        msg: "Failed to save the password. Try again",
      });
    }
    // console("password saved");
    // console("student is ", student);
    return res.send({ status: "success" });
  } catch (error) {
    // console("unable to find student");
    return res.send({
      status: "failed",
      msg: "Server Error. Failed to save the password. Try again",
    });
  }
};

// forget password
const forgetPassword = async (req, res) => {
  // console("In forget password");
  if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
    // console("invalid parameters");
    return res.send({ status: "failed", msg: "Invalid credentials" });
  }

  if (req.body.password !== req.body.confirmPassword) {
    // console("mismatch");
    return res.send({ status: "failed", msg: "Password is not same" });
  }

  try {
    const student = await studentModel.findOne({ email: req.body.email });
    if (!student) {
      // console("email not found");
      return res.send({ status: "failed", msg: "Email is invalid" });
    }
  } catch (error) {
    // console("error while find");
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
    const student = await studentModel.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: { password: hashedPassword },
      },
      { new: true }
    );
    if (!student) {
      // console("unable to update");
      return res.send({
        status: "failed",
        msg: "Unable to update password . Try again",
      });
    }
    // console("password updated");
    return res.send({ status: "success" });
  } catch (error) {
    // console("error while updating");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Unable to update password . Try again",
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
router.patch("/edit-profile", studentAuth, editUser);
router.patch("/change-password", studentAuth, changePassword);
router.get("/logout", studentAuth, logout);
router.patch("/forget-password", forgetPassword);

module.exports = router;
