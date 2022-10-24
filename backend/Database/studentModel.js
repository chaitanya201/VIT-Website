const mongoose = require("mongoose");
// connecting MongoDB
const url =
  "mongodb+srv://chaitanya:1234@vitdata.pe0psmh.mongodb.net/Data?retryWrites=true&w=majority";
mongoose.connect('mongodb://mongodb-img/VIT_Database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then().catch();

// defining schema
const userSchema = new mongoose.Schema({
  name: String,
  div: String,
  rollNo: String,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  position: { type: String, default: "student" },
  password: String,
  pic: { type: String, default: "https://firebasestorage.googleapis.com/v0/b/students-project-managem-80227.appspot.com/o/ProfilePictures%2FStudents%2F1de38ec2-1491-4217-a49c-add145b63756dummy%20image%205.jfif?alt=media&token=08aa7577-2eb8-4d3f-a347-1d4b33a1d327" },
  grNo: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
});

const userModel = new mongoose.model("UserData", userSchema);

module.exports = userModel;
