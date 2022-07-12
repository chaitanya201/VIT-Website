const teacherModel = require("../Database/teacherModel");
const jwt = require("jsonwebtoken");
const TEACHER_TOKEN_KEY = "alksnfkjasbvialfhKALGAILGHSAK%@#%#!%#@^$*&(%523522"

const teacherAuth = async (req, res, next) => {
  // console("In teacher Auth");
  const { authorization } = req.headers;
  // console("auth ", authorization);
  // console("req.file ", req.file);
  // console("name ", req.body.name);
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, TEACHER_TOKEN_KEY);
    } catch (error) {
      // console(error);
      if(error.name === 'TokenExpiredError') {
        let teacher;
        try {
          teacher = await teacherModel
            .findOne({ _id: req.query.teacherId })
            .select("-password");
        } catch (error) {
          // console("error while finding teacher with given id");
          return res.send({
            status: "failed",
            msg: "Please login again to continue",
          });
        }
        if (teacher) {
          // console("auth is successful");
          req.teacher = { ...teacher };
          const newToken = await jwt.sign(
            { teacherId: req.query.teacherId },
            teacher_TOKEN_KEY,
            {
              expiresIn: "1d",
            }
          );

          res.cookie("token", newToken, { maxAge: 86400000 });
          res.cookie("user", teacher, { maxAge: 86400000 });
          // console("teacher is ", req.teacher);
          next();
        } else {
          // console("teacher id is invalid ", teacherId);
          return res.send({ status: "failed", msg: "Please login again to continue" });
        }
      } 
      return res.send({ status: "failed", msg: "Something is wrong with token, Login again" });
    }
    const { teacherId } = jwt.verify(token, TEACHER_TOKEN_KEY);
    let teacher
    try {
        teacher = await teacherModel.findOne({ _id: teacherId }).select("-password");
        
    } catch (error) {
     // console("error while finding teacher with given id");
     return res.send({status : "failed" ,msg :"invalid token"})   
    }
    if (teacher) {
      // console("auth is successful");
      req.teacher = { ...teacher };
      next();
    } else {
      // console("teacher id is invalid ", teacherId);
      return res.send({ status: "failed", msg: "token is invalid" });
    }
  } else {
    // console("something is wrong with bearer token");
    res.send({ status: "failed", msg: "Something is wrong with Bearer token" });
  }
};

module.exports = teacherAuth;
