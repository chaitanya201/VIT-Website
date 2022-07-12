const express = require("express");
const router = express.Router();
const assetModel = require("../Database/assets");
const stockManagerAuth = require("../middleware/deadStockMiddleware");

router.post("/updateAssests", stockManagerAuth, async (req, res) => {
  console.log(req.body);
  if (!req.body.classroomName && !req.body.labName) {
    console.log("Invalid Parameter");
    return res.send({
      status: "falied",
      msg: "please provide valid parameters",
    });
  }
  try {
    var findData = await assetModel.find();
    console.log(findData);
    console.log(".......***.......");
  } catch (error) {}

  if (req.body.classroomName) {
    if (findData.length == 0 || findData[0].classroom.length == 0) {
      var data = new assetModel({
        classroom: [
          {
            name: req.body.classroomName,
            "chair.total": req.body.chair,
            "chair.working": req.body.workingChair,
            "chair.notWorking": req.body.notWorkingChair,
            "benches.total": req.body.benches,
            "benches.working": req.body.workingBench,
            "benches.notWorking": req.body.notWorkingBench,
            "fans.total": req.body.fans,
            "fans.working": req.body.workingFans,
            "fans.notWorking": req.body.notWorkingFans,
            "light.total": req.body.light,
            "light.working": req.body.WorkingLight,
            "light.notWorking": req.body.notWorkingLight,
          },
        ],

        lab: [
          {
            name: req.body.classroomName,
            "chair.total": req.body.chair,
            "chair.working": req.body.workingChair,
            "chair.notWorking": req.body.notWorkingChair,
            "benches.total": req.body.benches,
            "benches.working": req.body.workingBench,
            "benches.notWorking": req.body.notWorkingBench,
            "fans.total": req.body.fans,
            "fans.working": req.body.workingFans,
            "fans.notWorking": req.body.notWorkingFans,
            "light.total": req.body.light,
            "light.working": req.body.WorkingLight,
            "light.notWorking": req.body.notWorkingLight,
          },
        ],
      });
      data.save((err) => {
        if (err) {
          console.log("error occurred");
          console.log(err);
        }
        console.log("success");
        console.log(data);
      });
    } else {
      const updateData = await assetModel.findOneAndUpdate(
        {},
        {
          classroom: [
            ...findData[0].classroom,
            {
              name: req.body.classroomName,
              "chair.total": req.body.chair,
              "chair.working": req.body.workingChair,
              "chair.notWorking": req.body.notWorkingChair,
              "benches.total": req.body.benches,
              "benches.working": req.body.workingBench,
              "benches.notWorking": req.body.notWorkingBench,
              "fans.total": req.body.fans,
              "fans.working": req.body.workingFans,
              "fans.notWorking": req.body.notWorkingFans,
              "light.total": req.body.light,
              "light.working": req.body.WorkingLight,
              "light.notWorking": req.body.notWorkingLight,
            },
          ],
          lab: [
            ...findData[0].lab,
            {
              name: req.body.classroomName,
              "chair.total": req.body.chair,
              "chair.working": req.body.workingChair,
              "chair.notWorking": req.body.notWorkingChair,
              "benches.total": req.body.benches,
              "benches.working": req.body.workingBench,
              "benches.notWorking": req.body.notWorkingBench,
              "fans.total": req.body.fans,
              "fans.working": req.body.workingFans,
              "fans.notWorking": req.body.notWorkingFans,
              "light.total": req.body.light,
              "light.working": req.body.WorkingLight,
              "light.notWorking": req.body.notWorkingLight,
            },
          ],
        }
      );
      if (!updateData) {
        console.log("data not added");
        return res.send({ status: "falied", msg: "falied to add data" });
      }
      console.log("############################");
      console.log(updateData);
      return res.send({ status: "sucess" });
    }

    return res.send({ status: "failed" });
  }

  //to  labs
  if (req.body.labName) {
    try {
      var asset = await assetModel.findOneAndUpdate(
        { "labs.$.name": req.body.labName },
        {
          $set: {
            "lab.$.fans.total": 8908080,
            "lab.$.fans.working": 8908080,
            "lab.$.fans.notWorking": 8908080,
            "classroom.$.chair.total": 8908080,
            "classroom.$.chair.working": 8908080,
            "classroom.$.chair.notWorking": 8908080,
            "classroom.$.benches.total": 8908080,
            "classroom.$.benches.working": 8908080,
            "classroom.$.benches.notWorking": 8908080,
            "classroom.$.light.total": 8908080,
            "classroom.$.light.working": 8908080,
            "classroom.$.light.notWorking": 8908080,
          },
        },
        { new: true }
      );
    } catch (error) {
      return res.send({ status: "failed", msg: "SERVER ERROR" });
    }
    if (asset) return res.send({ status: "success", asset });
    return res.send({ status: "failed" });
  }
  console.log("Innvlid--a");
  return res.send({ status: "failed", msg: "Invalid Parameters" });
});

// UPDATE DATA

// UPDATE CLASSROOM

router.post("/update-classroom", stockManagerAuth, async (req, res) => {
  console.log("In update classroom");
  try {
    var asset = await assetModel.findOneAndUpdate(
      {
        "classroom.name": req.body.classroomName,
      },

      {
        $set: {
          "classroom.$.chair.total": req.body.chair,
          "classroom.$.chair.working": req.body.workingChair,
          "classroom.$.chair.notWorking": req.body.notWorkingChair,
          "classroom.$.benches.total": req.body.benches,
          "classroom.$.benches.working": req.body.workingBench,
          "classroom.$.benches.notWorking": req.body.notWorkingBench,
          "classroom.$.fans.total": req.body.fans,
          "classroom.$.fans.working": req.body.workingFans,
          "classroom.$.fans.notWorking": req.body.notWorkingFans,
          "classroom.$.light.total": req.body.light,
          "classroom.$.light.working": req.body.workingLight,
          "classroom.$.light.notWorking": req.body.notWorkingLight,
        },
      },
      { new: true }
    );

    //console.log(asset);
    return res.send({ status: "success", asset });
  } catch (error) {
    console.log("error");
    console.log(error);

    return res.send({ status: "failed", msg: "SERVER ERROR" });
  }
});

//to update lab
router.post("/update-lab", stockManagerAuth, async (req, res) => {
  console.log("In update lab");
  try {
    var asset = await assetModel.findOneAndUpdate(
      {
        "lab.name": req.body.labName,
      },

      {
        $set: {
          "lab.$.chair.total": req.body.chair,
          "lab.$.chair.working": req.body.workingChair,
          "lab.$.chair.notWorking": req.body.notWorkingChair,
          "lab.$.benches.total": req.body.benches,
          "lab.$.benches.working": req.body.workingBench,
          "lab.$.benches.notWorking": req.body.notWorkingBench,
          "lab.$.fans.total": req.body.fans,
          "lab.$.fans.working": req.body.workingFans,
          "lab.$.fans.notWorking": req.body.notWorkingFans,
          "lab.$.light.total": req.body.light,
          "lab.$.light.working": req.body.workingLight,
          "lab.$.light.notWorking": req.body.notWorkingLight,
        },
      },
      { new: true }
    );

    //console.log(asset);
    return res.send({ status: "success", asset });
  } catch (error) {
    console.log("error");
    console.log(error);

    return res.send({ status: "failed", msg: "SERVER ERROR" });
  }
});

//to show the classroom
router.get("/show-asstes-classroom", stockManagerAuth, async (req, res) => {
  console.log("in classroom");
  var asstes;
  try {
    asstes = await assetModel.findOne({
      "classroom.$.name": req.query.classroomName,
    });
    if (asstes) {
      let d = {};
      for (var i = 0; i < asstes.classroom.length; i++) {
        if (asstes.classroom[i].name === req.query.classroomName) {
          d = { ...asstes.classroom[i] };
          break;
        }
      }
      console.log("success");
      console.log(asstes);
      return res.send({ status: "success", asstes: d });
    }
    console.log(asstes);
    return res.send({ status: "success", msg: "No records found" });
  } catch (error) {
    return res.send({
      status: "failed",
      msg: "Provide valid data or server error",
    });
  }
});

//show labs
router.get("/show-asstes-lab", stockManagerAuth, async (req, res) => {
  console.log("in lab section");
  var asstes;
  try {
    asstes = await assetModel.findOne({
      "lab.$.name": req.query.labName,
    });
    if (asstes) {
      let d = {};
      for (var i = 0; i < asstes.lab.length; i++) {
        if (asstes.lab[i].name === req.query.labName) {
          d = { ...asstes.lab[i] };
          break;
        }
      }
      console.log("success", req.query.labName);
      console.log(d);
      return res.send({ status: "success", asstes: d });
    }
    console.log(asstes);
    return res.send({ status: "success", msg: "No records found" });
  } catch (error) {
    return res.send({
      status: "failed",
      msg: "Provide valid data or server error",
    });
  }
});
module.exports = router;
