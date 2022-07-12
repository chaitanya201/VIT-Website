const adminModel = require("../Database/adminModel");
const jwt = require("jsonwebtoken");
const ADMIN_TOKEN_KEY = "nvsknv;GHAHATHP5{}|)(*#$%578923";

const adminAuth = async (req, res, next) => {
  // console("In admin Auth");
  const { authorization } = req.headers;
  // console("auth ", authorization);
  // console("req.file ", req.file);
  // console("name ", req.body.name);
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, ADMIN_TOKEN_KEY);
    } catch (error) {
      // console("ERROR IS ",error);
      if (error.name === "TokenExpiredError") {
        let admin;
        try {
          admin = await adminModel
            .findOne({ _id: req.query.adminId })
            .select("-password");
        } catch (error) {
          // console("error while finding admin with given id");
          return res.send({
            status: "failed",
            msg: "Please login again to continue",
          });
        }
        if (admin) {
          // console("auth is successful");
          req.admin = { ...admin };
          const newToken = await jwt.sign(
            { adminId: req.query.adminId },
            ADMIN_TOKEN_KEY,
            {
              expiresIn: "1d",
            }
          );

          res.cookie("token", newToken, { maxAge: 86400000 });
          res.cookie("user", admin, { maxAge: 86400000 });
          // console("admin is ", req.admin);
          next();
        } else {
          // console("admin id is invalid ", adminId);
          return res.send({ status: "failed", msg: "Please login again to continue" });
        }

        // return res.send({ status: "failed", msg: "Session has expired. Please login again" })
      }
      return res.send({ status: "failed", msg: "Invalid token, login again" });
    }
    const { adminId } = jwt.verify(token, ADMIN_TOKEN_KEY);
    let admin;
    try {
      admin = await adminModel.findOne({ _id: adminId }).select("-password");
    } catch (error) {
      // console("error while finding admin with given id");
      return res.send({ status: "failed", msg: "invalid token" });
    }
    if (admin) {
      // console("auth is successful");
      req.admin = { ...admin };
      // console("admin is ", req.admin);
      next();
    } else {
      // console("admin id is invalid ", adminId);
      return res.send({ status: "failed", msg: "token is invalid" });
    }
  } else {
    // console("something is wrong with bearer token");
    res.send({ status: "failed", msg: "Something is wrong with Bearer token" });
  }
};

module.exports = adminAuth;
