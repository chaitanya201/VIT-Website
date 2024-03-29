const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true,unique: true  },
  password: { type: String, required: true },
  pic: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/students-project-managem-80227.appspot.com/o/ProfilePictures%2FStudents%2F1de38ec2-1491-4217-a49c-add145b63756dummy%20image%205.jfif?alt=media&token=08aa7577-2eb8-4d3f-a347-1d4b33a1d327",
  },
  position: { type: String, default: "teacher" },
});

const teacherModel = new mongoose.model("TeacherData", teacherSchema);

module.exports = teacherModel;
