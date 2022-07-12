const mongoose = require("mongoose");

const useSchema = new mongoose.Schema({
  name: "String",
  email: "String",
  position: {
    type: "String",
    default: "deadStockManager",
  },
  password: "String",
});

const stockUser = new mongoose.model("DeadStockManager", useSchema);
module.exports = stockUser;
