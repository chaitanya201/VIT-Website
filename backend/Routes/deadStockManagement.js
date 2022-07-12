const express = require("express");
const router = express.Router();
const multer = require("multer");
const stockUser = require("../Database/deadStockManager");
const Product = require("../Database/productModel");
const stockManagerAuth = require("../middleware/deadStockMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const TOKEN_KEY = "ALSGHJAIL5982763Ffhiasgfbila^#$^@#%@@#^#$"





var componentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("in multer ....................");
    console.log("multer file is ", file);
    cb(
      null,
      "D:/Node  JS Projects/Students Project Management And Asset Management Webapp/backend/public/componentImage"
    );
  },
  filename: function (req, file, cb) {
    cb(null, "_" + file.originalname);
  },
});

const uploadComponentStorage = multer({
  storage: componentStorage,
}).single("componentImage");



// REGISTRATION OF STOCK MANAGER
const registrationSchema = joi.object({
  name: joi.string().min(3).max(100).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .min(8)
    .max(50)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
const registration = async (req, res) => {
  console.log("Checking user credentials for registration");
  console.log(req.body);
  const { error } = await registrationSchema.validate({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  if (error) {
    console.log("error in joi");
    console.log(error);
    return res.send({ status: "failed", msg: error.details[0].message });
  }

  let user;
  try {
    user = await stockUser.findOne({ email: req.body.email });
    if (user) {
      // console("user already exists");
      return res.send({ status: "failed", msg: "user already exists" });
    }
  } catch (error) {
    // console("error while finding user");
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
  user = new stockUser({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  user.save((err) => {
    if (err) {
      console.log("err while saving user");
      console.log(err);
      return res.send({
        status: "failed",
        msg: "server error while saving user",
      });
    }
    console.log("user saved successfully");
    return res.send({ status: "success", msg: "user saved successfully" });
  });
};



// login part
const login = async (req, res) => {
  console.log("checking credentials for login");
  
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  const { error } = await loginSchema.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (error) return res.send({ status: "failed", msg: "Provide valid data" });

  let user;
  try {
    user = await stockUser.findOne({ email: req.body.email });
    if (!user) {
      // console.log("user does not exists");
      return res.send({ status: "failed", msg: "user does not exists" });
    }
  } catch (error) {
    // console.log("error while getting user");
    return res.send({ status: "failed", msg: "server error" });
  }

  let isValid = false;
  try {
    isValid = bcrypt.compare(req.body.password, user.password);
  } catch (error) {
    // console.log("error while validating password");
    return res.send({ status: "failed", msg: "server error" });
  }

  if (isValid) {
    const token = await jwt.sign({ userId: user._id }, TOKEN_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      maxAge: 86400000,
      path: "/",
    });
    res.cookie("user", user, {
      maxAge: 86400000,
      path: "/",
    });
    // res.clearCookie('teacher', {path:"/"})
    // res.clearCookie('teacherToken', {path:"/"})
    // res.clearCookie('admin', {path:"/"})
    // res.clearCookie('adminToken', {path:"/"})
    // res.cookie("a", "20")
    // console("login successful");
    res.send({ status: "success", msg: "Login successful", token, user });
  } else {
    // console("password is wrong");
    return res.send({
      status: "failed",
      msg: "Email or Password is incorrect",
    });
  }
};


const addNewProduct = async (req, res) => {
  //const { image, name, quantity, cost, condition, date} = req.body;
  console.log(req.body);
  if(!req.body.name || !req.body.quantity || !req.body.cost || !req.body.condition || !req.body.date) {
    return res.send({status : "failed", msg : "Please provide valid data."})
  }
  try {
    const newproduct = new Product({
      name: req.body.name,
      quantity: req.body.quantity,
      cost: req.body.cost,
      condition: req.body.condition,
      date: req.body.date,
      image: req.file ? req.file.filename : "img1.jpg",
    });
    newproduct.save((err) => {
      if (err) {
        console.log("Error Occured While Saving");
        console.log(err);
        return res.send({
          message: "Error Occured While Saving",
          status: "Fail",
        });
      }
      console.log("Data Saved");
      console.log("new product", newproduct);
      return res.send({
        message: "Data Saved",
        status: "Success",
      });
    });
  } catch (error) {
    console.log("Error Occured");
    return res.send({
      message: "Error Occured While Saving",
      status: "Fail",
    });
  }
};

// get all products

const getAllProducts = async (req, res) => {
  console.log("in get products");
  try {
    const getProduct = await Product.find({});
    console.log("Success");
    console.log(getProduct);
    return res.send({
      message: "Success",
      status: "Success",
      allProducts: getProduct,
    });
  } catch (error) {
    console.log("Error");
    return res.send({
      message: "Server Error",
      status: "Fail",
    });
  }
};

const deleteProduct = async (req, res) => {
  console.log("Not Deleted Error");
  try {
    const findProduct = await Product.findById({ _id: req.query.productId });
    if (!findProduct) {
      console.log("Product id is wrong");
      return res.send({
        message: "Invalid Product",
        status: "Fail",
      });
    }
  } catch (error) {
    console.log("Finding was unsuccessful");
    return res.send({
      message: "Invalid Product",
      status: "Fail",
    });
  }
  try {
    const deleteProduct = await Product.deleteOne({ _id: req.query.productId });
    if (!deleteProduct) {
      console.log("Product Not Deleted");
      return res.send({
        message: "Error while deleting product",
        status: "Fail",
      });
    }
    console.log("Product deleted successfully");
    return res.send({
      message: "Product Deleted",
      status: "Success",
    });
  } catch (error) {
    console.log("Delete was unsuccessful");
    return res.send({
      message: "Error while deleting product",
      status: "Fail",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    var findProduct = await Product.findById({ _id: req.body.productId });
    if (!findProduct) {
      console.log("Product id is wrong");
      return res.send({
        message: "Invalid Product",
        status: "Fail",
      });
    }
  } catch (error) {
    console.log("Finding was unsuccessful");
    return res.send({
      message: "Invalid Product",
      status: "Fail",
    });
  }
  try {
    const updateProduct = await Product.findOneAndUpdate(
      { _id: req.body.productId },
      {
        cost: req.body.cost,
        name: req.body.name,
        condition: req.body.condition,
        date: req.body.date,
        quantity: req.body.quantity,
        image: req.file ? req.file.filename : findProduct.image,
      },
      { new: true }
    );
    if (!updateProduct) {
      console.log("Product Not Updated");
      return res.send({
        message: "Error while updating product",
        status: "Fail",
      });
    }
    console.log("Product updated successfully");
    return res.send({
      message: "Product Updated",
      status: "Success",
      product: updateProduct,
    });
  } catch (error) {
    console.log("Update was unsuccessful");
    return res.send({
      message: "Error while updating product",
      status: "Fail",
    });
  }
};

const getChartData = async (req, res) => {
  console.log("In getdata function");
  let working;
  let NotWorkingRepairable;
  let NotWorkingNotRepairable;

  try {
    const workingData = await Product.find({ condition: "Working" });
    working = workingData.length > 0 ? workingData.length : 0;
    if (working == 0) {
      console.log("Data is zero");
      return res.send({
        message: "No data found",
        status: "Fail",
      });
    }
  } catch (error) {
    console.log("Error while finding the product");
    return res.send({
      message: "Error while updating product",
      status: "Fail",
    });
  }

  try {
    const workingData = await Product.find({
      condition: "Not Working but Repairable",
    });
    NotWorkingRepairable = workingData.length > 0 ? workingData.length : 0;
    if (NotWorkingRepairable == 0) {
      console.log("Data is zero");
      return res.send({
        message: "No data found",
        status: "Fail",
      });
    }
  } catch (error) {
    console.log("Error while finding the product");
    return res.send({
      message: "Error while updating product",
      status: "Fail",
    });
  }

  try {
    const workingData = await Product.find({
      condition: "Not Working and Not Repairable",
    });
    NotWorkingNotRepairable = workingData.length > 0 ? workingData.length : 0;
    if (NotWorkingNotRepairable == 0) {
      console.log("Data is zero");
      return res.send({
        message: "No data found",
        status: "Fail",
      });
    }
  } catch (error) {
    console.log("Error while finding the product");
    return res.send({
      message: "Error while updating product",
      status: "Fail",
    });
  }
  if (working && NotWorkingRepairable && NotWorkingNotRepairable) {
    console.log("Data successfully found");
    return res.send({
      message: "Data found",
      status: "Success",
      working,
      NotWorkingRepairable,
      NotWorkingNotRepairable,
    });
  }

  console.log("Error while finding number of data");
  return res.send({
    message: "Insufficient data",
    status: "Fail",
  });
};

const logout = async (req, res) => {
  console.log("In logout");
  res.clearCookie("user");
  res.clearCookie("token");
  return res.send({ status: "success" });
}

router.post('/register', registration);
router.post('/login', login);
router.post('/newproduct',stockManagerAuth,uploadComponentStorage, addNewProduct);
router.delete('/deleteproduct',stockManagerAuth ,deleteProduct);
router.put('/updateproduct',uploadComponentStorage, stockManagerAuth,updateProduct);


router.get('/getproducts', stockManagerAuth,getAllProducts);
router.get('/getdata',stockManagerAuth,getChartData);
router.get('/logout',stockManagerAuth,logout);


module.exports = router;
