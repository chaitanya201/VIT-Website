const jwt = require("jsonwebtoken");
const stockUser = require("../Database/deadStockManager");
const TOKEN_KEY = "ALSGHJAIL5982763Ffhiasgfbila^#$^@#%@@#^#$";

const stockManagerAuth = async (req, res, next) => {
  console.log("In user Auth");
  const { authorization } = req.headers;
  // console("auth ", authorization);
  // console("req.file ", req.file);
  // console("name ", req.body.name);
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    var userId;
    try {
      ({ userId } = jwt.verify(token, TOKEN_KEY));
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        let user;
        try {
          user = await stockUser
            .findOne({ _id: req.query.userId })
            .select("-password");
        } catch (error) {
          // console("error while finding user with given id");
          return res.send({
            status: "failed",
            msg: "Please login again to continue",
          });
        }
        if (user) {
          // console("auth is successful");
          req.user = { ...user };
          const newToken = await jwt.sign(
            { userId: req.query.userId },
            user_TOKEN_KEY,
            {
              expiresIn: "1d",
            }
          );

          res.cookie("stockManagerToken", newToken, { maxAge: 86400000 });
          res.cookie("stockManager", student, { maxAge: 86400000 });
          // console("user is ", req.user);
          next();
        } else {
          // console("user id is invalid ", userId);
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
    let user;
    try {
      user = await stockUser
        .findOne({ _id: userId })
        .select("-password");
    } catch (error) {
      // console("error while finding user with given id");
      return res.send({ status: "failed", msg: "invalid token" });
    }
    if (user) {
      console.log("auth is successful");
      req.user = { ...user };
      next();
    } else {
      // console("student id is invalid ", userId);
      return res.send({ status: "failed", msg: "token is invalid" });
    }
  } else {
    // console("something is wrong with bearer token");
    res.send({ status: "failed", msg: "Something is wrong with Bearer token" });
  }
};

module.exports = stockManagerAuth;
