const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const teacherAuth = require("../middleware/teacherAuth");
const teacherModel = require("../Database/teacherModel");
const studentModel = require("../Database/studentModel");
const projectModel = require("../Database/projectModel");

// ************************************  KEYS  **************************************
const TEACHER_TOKEN_KEY = "alksnfkjasbvialfhKALGAILGHSAK%@#%#!%#@^$*&(%523522";
const TEACHER_FORGOT_PASSWORD = "ALS;JHGA;LSptqoiuyknvsk&@#^%2626235&$&63474";
const TEACHER_REGISTER_KEY =
  'TeacherFkasvnvksalhaajliwlurh&@#^@%@14141563&#$^@532:}{:{>":';

// Registration

const registrationSchema = joi.object({
  name: joi.string().min(3).max(100).required(),

  email: joi.string().email().required(),
  secreteKey: joi.string().required(),
  mobile: joi.number().min(1000000000).required(),
  password: joi
    .string()
    .min(8)
    .max(50)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

const registration = async (req, res) => {
  // console("Checking teacher credentials for registration");

  const { error } = await registrationSchema.validate({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    secreteKey: req.body.secreteKey,
  });

  if (error) {
    // console("error in joi");
    // console(error);
    return res.send({ status: "failed", msg: error.details[0].message });
  }

  if (TEACHER_REGISTER_KEY !== req.body.secreteKey) {
    // console("invalid secrete key");
    return res.send({
      status: "failed",
      msg: "Please provide valid Secrete Key",
    });
  }
  let teacher;
  try {
    teacher = await teacherModel.findOne({ email: req.body.email });
    if (teacher) {
      // console("teacher already exists");
      return res.send({ status: "failed", msg: "Teacher already exists" });
    }
  } catch (error) {
    // console("error while finding teacher");
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
  teacher = new teacherModel({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: hashedPassword,
    pic: req.file ? req.file.filename : "dummy image 4.png",
  });

  teacher.save((err) => {
    if (err) {
      // console("err while saving teacher");
      return res.send({
        status: "failed",
        msg: "server error while saving teacher",
      });
    }
    // console("teacher saved successfully");
    return res.send({ status: "success", msg: "teacher saved successfully" });
  });
};

// login

const login = async (req, res) => {
  // console("checking teachers for login");
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  const { error } = await loginSchema.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (error) return res.send({ status: "failed", msg: "Provide valid data" });

  let teacher;
  try {
    teacher = await teacherModel.findOne({ email: req.body.email });
    if (!teacher) {
      // console("teacher does not exists");
      return res.send({ status: "failed", msg: "teacher does not exists" });
    }
  } catch (error) {
    // console("error while getting teacher");
    return res.send({ status: "failed", msg: "server error" });
  }

  let isValid = false;
  try {
    //console.log("started checking")
    isValid = await bcrypt.compare(req.body.password, teacher.password);
    //console.log("ended checking");
  } catch (error) {
    // console("error while validating password");
    return res.send({ status: "failed", msg: "server error" });
  }

  if (isValid) {
    const token = await jwt.sign({ teacherId: teacher._id }, TEACHER_TOKEN_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { maxAge: 86400000 });
    res.cookie("user", teacher, { maxAge: 86400000 });
    // res.clearCookie('student', {path:"/"})
    // res.clearCookie('token', {path:"/"})
    // res.clearCookie('admin', {path:"/"})
    // res.clearCookie('adminToken', {path:"/"})
    // console("login successful");
    res.send({ status: "success", msg: "Login successful", token, teacher });
  } else {
    //console.log("password is wrong");
    return res.send({
      status: "failed",
      msg: "Email or Password is incorrect",
    });
  }
};

// MARKS SECTION

// MIDSEM MARKS

const addMidSemMarks = async (req, res) => {
  // console("In mid sem marks");

  try {
    const validTeacher = await projectModel.findOne({
      projectHead: req.teacher._doc._id,
      _id: req.body.projectId,
    });
    if (!validTeacher) {
      // console("teacher not found");
      return res.send({
        status: "failed",
        msg: "You don't have the permission to add marks.",
      });
    }
  } catch (error) {
    // console("error while finding teacher");
    // console(error);
    return res.send({ status: "failed", msg: "Invalid teacher or project" });
  }

  try {
    const validStudent = await projectModel.findOne({
      students: req.body.studentId,
      _id: req.body.projectId,
      projectHead: req.teacher._doc._id,
    });
    if (!validStudent) {
      // console("student not found");
      return res.send({ status: "failed", msg: "Student not found." });
    }
  } catch (error) {
    // console("error while finding student");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Something went wrong, while finding student.",
    });
  }

  try {
    const projectApproved = await projectModel.findOne({
      _id: req.body.projectId,
      projectHead: req.teacher._doc._id,
      students: req.body.studentId,
      isApproved: true,
    });
    if (!projectApproved) {
      // console("project not approved");
      return res.send({ status: "failed", msg: "Project is not approved" });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Try again later.",
    });
  }
  // console("body is ");
  // console(req.body);
  // const test = await projectModel.findOne({
  //   _id: req.body.projectId,
  //   projectHead: req.teacher._doc._id,
  //   "marks.studentId": req.body.studentId,
  // });
  // // console("founded project is ", test);
  // // console("teacjer is ", req.teacher._doc);
  // console("calculation is");
  // console();
  // console("TYPE IS ", typeof req.body.literatureReview);
  // console("TYPE IS ", typeof req.body.problemStatement);
  // console("TYPE IS ", typeof req.body.groupFormation);
  // console("TYPE IS ", typeof req.body.objective);
  // console("TYPE IS ", typeof req.body.knowledgeOfDomain);
  try {
    const addMarks = await projectModel
      .findOneAndUpdate(
        {
          _id: req.body.projectId,
          projectHead: req.teacher._doc._id,
          "marks.studentId": req.body.studentId,
        },
        // if we not use $set then we can update any one or all the attributes of the objects which are nested in the array
        // like the below example. here we can update midSem, endSem, total anything without using $set operator
        // but if we use set then we must have to provide all the fields of the object while updating
        // so if u want to update only midsem attribute then u have to provide endsem, total as well
        // otherwise it will not work.
        // so try not to use $set operator here.

        // summary is without $set we can update any field of the nested array object but with $set we must have to provide
        // all other fields as well.
        {
          "marks.$.midSem": {
            problemStatement: req.body.problemStatement,
            literatureReview: req.body.literatureReview,
            groupFormation: req.body.groupFormation,
            objective: req.body.objective,
            KnowledgeOfDomain: req.body.KnowledgeOfDomain,
            totalConverted:
              (3 / 5) *
              (req.body.problemStatement +
                req.body.literatureReview +
                req.body.groupFormation +
                req.body.objective +
                req.body.knowledgeOfDomain),
          },

          // "marks.$.studentId": req.body.studentId,
        },

        { new: true }
      )
      .populate("students")
      .populate("marks.studentId");
    // console("added marks");
    // console(addMarks);
    if (!addMarks) {
      // console("marks not added");
      return res.send({
        status: "failed",
        msg: "Server Error. Try again later.",
      });
    }
    // console("marks added");
    return res.send({
      status: "success",
      msg: "marks added",
      project: addMarks,
    });
  } catch (error) {
    // console("error while adding marks");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Try again later.",
    });
  }
};

// Add endSem marks
const addEndSemMarks = async (req, res) => {
  // console("In end sem marks");

  try {
    const validTeacher = await projectModel.findOne({
      projectHead: req.teacher._doc._id,
      _id: req.body.projectId,
    });
    if (!validTeacher) {
      // console("teacher not found");
      return res.send({
        status: "failed",
        msg: "You don't have the permission to add marks.",
      });
    }
  } catch (error) {
    // console("error while finding teacher");
    // console(error);
    return res.send({ status: "failed", msg: "Invalid teacher or project" });
  }

  try {
    var studentExists = await studentModel.findOne({ _id: req.body.studentId });
    if (!studentExists) {
      // console("student not exists");
      return res.send({ status: "failed", msg: "Student is not registered" });
    }
  } catch (error) {
    // console("error while finding student");
    // console(error);
    return res.send({ status: "failed", msg: "Invalid student" });
  }

  try {
    const validStudent = await projectModel.findOne({
      students: req.body.studentId,
      _id: req.body.projectId,
      projectHead: req.teacher._doc._id,
    });
    if (!validStudent) {
      // console("student not found");
      return res.send({ status: "failed", msg: "Student not found." });
    }
  } catch (error) {
    // console("error while finding student");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Something went wrong, while finding student.",
    });
  }

  try {
    var projectApproved = await projectModel.findOne({
      _id: req.body.projectId,
      projectHead: req.teacher._doc._id,
      students: req.body.studentId,
      isApproved: true,
    });
    if (!projectApproved) {
      // console("project not approved");
      return res.send({ status: "failed", msg: "Project is not approved" });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Try again later.",
    });
  }
  let marks = 0;
  for (let index = 0; index < projectApproved.marks.length; index++) {
    if (projectApproved.marks[index].studentId.equals(req.body.studentId)) {
      marks = projectApproved.marks[index].midSem.totalConverted;
    }
  }
  try {
    const addMarks = await projectModel
      .findOneAndUpdate(
        {
          _id: req.body.projectId,
          projectHead: req.teacher._doc._id,
          "marks.studentId": req.body.studentId,
        },
        {
          "marks.$.endSem": {
            projectRealization: req.body.projectRealization,
            projectDesignAndTesting: req.body.projectDesignAndTesting,
            reportWriting: req.body.reportWriting,
            QualityOfWork: req.body.QualityOfWork,
            performanceInAssessment: req.body.performanceInAssessment,
            timelyCompletion: req.body.timelyCompletion,
            totalConverted:
              (7 / 10) *
              (req.body.projectRealization +
                req.body.projectDesignAndTesting +
                req.body.reportWriting +
                req.body.QualityOfWork +
                req.body.performanceInAssessment +
                req.body.timelyCompletion),
          },
          "marks.$.total":
            marks +
            (7 / 10) *
              (req.body.projectRealization +
                req.body.projectDesignAndTesting +
                req.body.reportWriting +
                req.body.QualityOfWork +
                req.body.performanceInAssessment +
                req.body.timelyCompletion),
        },

        { new: true }
      )
      .populate("students")
      .populate("marks.studentId");
    // console("added marks");
    // console(addMarks);
    if (!addMarks) {
      // console("marks not added");
      return res.send({
        status: "failed",
        msg: "Server Error. Try again later.",
      });
    }
    // console("marks added");
    return res.send({
      status: "success",
      msg: "marks added",
      project: addMarks,
    });
  } catch (error) {
    // console("error while adding marks");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Try again later.",
    });
  }
};

// teacher edit profile
const editTeacherProfile = async (req, res) => {
  // console("in teacher edit profile function");
  const editProfileSchema = joi.object({
    name: joi.string().min(3).max(100).required(),

    email: joi.string().email().required(),
    mobile: joi.number().min(1000000000).required(),
  });

  const { error } = await editProfileSchema.validate({
    name: req.body.name,
    email: req.body.currentEmail,
    mobile: req.body.mobile,
  });

  if (error) {
    // console("error in joi");
    // console(error);
    return res.send({ status: "failed", msg: error.details[0].message });
  }

  if (req.body.newEmail !== req.body.currentEmail) {
    try {
      const userExists = await teacherModel.findOne({
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
    var find = await teacherModel.findOne({ _id: req.teacher._doc._id });
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
    const result = await teacherModel.findOneAndUpdate(
      { email: req.body.currentEmail },
      {
        $set: {
          name: req.body.name,
          email: req.body.newEmail,
          mobile: req.body.mobile,
          pic: req.body.pic ? req.body.pic : find.pic,
        },
      },
      { new: true }
    );
    if (result) {
      const token = await jwt.sign({ teacherId: result._id }, TEACHER_TOKEN_KEY, {
        expiresIn: "1d",
      });
      res.cookie("user", result, { maxAge: 86400000 });
      res.cookie("token", token, { maxAge: 86400000 });
      res.send({
        status: "success",
        msg: "updating is successful",
        teacher: result,
      });
      // console("changes saved");
    } else {
      res.send({ msg: "error has occurred while saving. Try again later" });
      // console("error while saving changes", result);
    }
  } catch (error) {
    // console("error while updating");
    // console(error);
    return res.send({ status: "failed", msg: "Failed to update the details." });
  }
};

// Search Project Queries

const search = async (req, res) => {
  // console("In search part");
  // console(req.query);
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
          projectHead: req.teacher._doc._id,
          studentYear: req.query.studentYear,
          div: req.query.div,
          branch: req.query.branch,
          isApprovedByAdmin:
            req.query.isApprovedByAdmin === "true" ? true : false,
        })
        .populate("students")
        .populate("marks.studentId");
      // console("result is ", result);
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
    var teacher = await teacherModel.findOne({ _id: req.teacher._doc._id });
    if (!teacher) {
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
  const check = bcrypt.compare(req.body.originalPassword, teacher.password);
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
    const teacher = await teacherModel.findOneAndUpdate(
      { _id: req.teacher._doc._id },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (!teacher) {
      // console("unable to save student");
      return res.send({
        status: "failed",
        msg: "Failed to save the password. Try again",
      });
    }
    // console("password saved");

    // console("teacher is ", teacher);
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
  // console("in forgot pass");

  if (!req.body.email || !req.body.password || !req.body.key) {
    // console("please provide all the parameters");
    return res.send({
      status: "failed",
      msg: "please provide all the parameters",
    });
  }

  if (req.body.key !== TEACHER_FORGOT_PASSWORD) {
    // console("wrong key");
    return res.send({ status: "failed", msg: "Key is invalid" });
  }

  try {
    const teacher = await teacherModel.findOne({ email: req.body.email });
    if (!teacher) {
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
    const teacher = await teacherModel.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (!teacher) {
      // console("unable to save student");
      return res.send({
        status: "failed",
        msg: "Failed to save the password. Try again",
      });
    }
    // console("password saved");

    // console("admin is ", teacher);
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
router.get("/logout", teacherAuth, logout);
router.patch("/forget-password", forgetPassword);
router.patch("/edit-profile", teacherAuth, editTeacherProfile);

router.get("/get-all-projects", teacherAuth, search);
router.patch("/add-midsem-marks", teacherAuth, addMidSemMarks);
router.patch("/add-endsem-marks", teacherAuth, addEndSemMarks);
router.patch("/change-password", teacherAuth, changePassword);

module.exports = router;
