const mongoose = require("mongoose");
// connecting MongoDB


// defining schema
const assetschema = new mongoose.Schema({
  // classroom : [{computers:{type:Number},chairs:{type:Number},fans:{type:Number},className:{type:String}}],
  classroom: [
    {
      name: { type: "String" },
      chair: {
        total: { type: "Number" },
        working: { type: "Number" },
        notWorking: { type: "Number" },
      },
      benches: {
        total: { type: "Number" },
        working: { type: "Number" },
        notWorking: { type: "Number" },
      },
      fans: {
        total: { type: "Number" },
        working: { type: "Number" },
        notWorking: { type: "Number" },
      },
      light: {
        total: { type: "Number" },
        working: { type: "Number" },
        notWorking: { type: "Number" },
      },
    },
  ],
  lab: [
    {
      name: { type: "String" },
      chair: {
        total: { type: "Number" },
        working: { type: "Number" },
        notWorking: { type: "Number" },
      },
      benches: {
        total: { type: "Number" },
        working: { type: "Number" },
        notWorking: { type: "Number" },
      },
      fans: {
        total: { type: "Number" },
        working: { type: "Number" },
        notWorking: { type: "Number" },
      },
      light: {
        total: { type: "Number" },
        working: { type: "Number" },
        notWorking: { type: "Number" },
      },
    },
  ],
  // labs : [{computers:{type:Number},chairs:{type:Number},fans:{type:Number},labName:{type:String}}],
});

const assetModel = new mongoose.model("AssetData", assetschema);

module.exports = assetModel;
