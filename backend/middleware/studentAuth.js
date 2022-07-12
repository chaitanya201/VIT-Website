const studentModel = require("../Database/studentModel");
const jwt = require("jsonwebtoken");
const SECRETKEY = "alksnfkjasbvialfhKALGAILGHSAK%@#%#!%#@^$*&(%523522";

const studentAuth = async (req, res, next) => {
  // console("In student Auth");
  const { authorization } = req.headers;
  // console("auth ", authorization);
  // console("req.file ", req.file);
  // console("name ", req.body.name);
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    var studentId;
    try {
      ({ studentId } = jwt.verify(token, SECRETKEY));
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        let student;
        try {
          student = await studentModel
            .findOne({ _id: req.query.studentId })
            .select("-password");
        } catch (error) {
          // console("error while finding student with given id");
          return res.send({
            status: "failed",
            msg: "Please login again to continue",
          });
        }
        if (student) {
          // console("auth is successful");
          req.student = { ...student };
          const newToken = await jwt.sign(
            { studentId: req.query.studentId },
            student_TOKEN_KEY,
            {
              expiresIn: "1d",
            }
          );

          res.cookie("token", newToken, { maxAge: 86400000 });
          res.cookie("user", student, { maxAge: 86400000 });
          // console("student is ", req.student);
          next();
        } else {
          // console("student id is invalid ", studentId);
          return res.send({
            status: "failed",
            msg: "Please login again to continue",
          });
        }
      }
      return res.send({
        status: "failed",
        msg: "Invalid token. login again and continue",
      });
    }
    let student;
    try {
      student = await studentModel
        .findOne({ _id: studentId })
        .select("-password");
    } catch (error) {
      // console("error while finding student with given id");
      return res.send({ status: "failed", msg: "invalid token" });
    }
    if (student) {
      // console("auth is successful");
      req.student = { ...student };
      next();
    } else {
      // console("student id is invalid ", studentId);
      return res.send({ status: "failed", msg: "token is invalid" });
    }
  } else {
    // console("something is wrong with bearer token");
    res.send({ status: "failed", msg: "Something is wrong with Bearer token" });
  }
};

module.exports = studentAuth;
