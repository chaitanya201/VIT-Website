const express = require("express");
const router = express.Router();
const projectModel = require("../Database/projectModel");
const joi = require("joi");
const studentModel = require("../Database/studentModel");
const studentsAuth = require("../middleware/studentAuth");
const teacherModel = require("../Database/teacherModel");
const teacherAuth = require("../middleware/teacherAuth");

// STUDENTS PART **************************************

// ADD PROJECT
const addProject = async (req, res) => {
  // console("in add project");
  // console("req.body is ", req.body);

  let groupMembersIds = [];

  try {
    let student = await studentModel.findOne({ _id: req.body.studentId });
    if (!student || !student.position === "student") {
      // console("invalid student", student);
      return res.send({
        status: "failed",
        msg: "Server error! Provide Valid data ",
      });
    }
  } catch (error) {
    // console("error while finding student");
    return res.send({
      status: "failed",
      msg: "Server error! Provide valid data",
    });
  }

  let teacher;
  try {
    teacher = await teacherModel.findOne({ email: req.body.projectHead });
    if (!teacher) {
      // console("teacher not found");
      return res.send({
        status: "failed",
        msg: "Provided Teachers email ID is wrong",
      });
    }
  } catch (error) {
    // console("error while finding teacher ", error);
    return res.send({ status: "failed", msg: "Server error! Try again later" });
  }

  const projectSchema = joi.object({
    title: joi.string().trim().min(10).required(),
    abstract: joi.string().trim().min(10).required(),
    subject: joi.string().min(3).required(),
    year: joi.string().required(),
    div: joi.string().required(),
    branch: joi.string().required(),
    projectHead: joi.string().email().required(),
    isGroupProject: joi.boolean().required(),
    groupMembers: joi.array().min(1).max(6).required(),
    sem: joi.number().max(2).min(1).required(),
  });
  const { error } = projectSchema.validate({
    title: req.body.title,
    abstract: req.body.abstract,
    subject: req.body.subject,
    projectHead: req.body.projectHead,
    isGroupProject: req.body.isGroupProject,
    groupMembers: req.body.groupMembers,
    sem: req.body.sem,
    year: req.body.year,
    div: req.body.div,
    branch: req.body.branch,
  });

  if (error) {
    // console("error in validating data in joi ");
    // console(error);
    return res.send({ status: "failed", msg: "Data is not in proper format" });
  }

  for (let index = 0; index < req.body.groupMembers.length; index++) {
    try {
      const student = await studentModel.findOne({
        email: req.body.groupMembers[index],
      });
      if (!student) {
        // console("unable to find student in loop");
        return res.send({ status: "failed", msg: "Provided Email is invalid" });
      } else {
        groupMembersIds.push(student._id);
      }
    } catch (error) {
      // console("error while finding student");
      return res.send({ status: "failed", msg: "Provided email is invalid" });
    }
  }
  // console("members ", groupMembersIds);
  const marks = [];
  for (let index = 0; index < groupMembersIds.length; index++) {
    marks.push({
      midSem: {
        problemStatement: 0,
        literatureReview: 0,
        groupFormation: 0,
        objective: 0,
        KnowledgeOfDomain: 0,
        totalConverted: 0,
      },
      endSem: {
        projectRealization: 0,
        projectDesignAndTesting: 0,
        reportWriting: 0,
        QualityOfWork: 0,
        performanceInAssessment: 0,
        timelyCompletion: 0,
        totalConverted: 0,
      },
      total: 0,
      studentId: groupMembersIds[index],
    });
  }
  // console("marks is ", marks);
  const project = new projectModel({
    title: req.body.title,
    abstract: req.body.abstract,
    subject: req.body.subject,
    projectHead: teacher._id,
    students: groupMembersIds,
    isGroupProject: req.body.isGroupProject,
    sem: req.body.sem,
    studentYear: req.body.year,
    div: req.body.div,
    branch: req.body.branch,
    marks: marks,
  });

  project.save((err) => {
    if (err) {
      // console("error while saving project", err);
      return res.send({
        status: "failed",
        msg: "Server error while saving project. Please try again",
      });
    }
    // console("project added");
    return res.send({ status: "success", msg: "Project added" });
  });
};

// get all students pending projects
const getAllStudentsPendingProjects = async (req, res) => {
  // console("in studentsla shf;o");
  // console("query is ");
  // console(req.query);
  if (
    !req.query.year ||
    !req.query.sem ||
    !req.query.subject ||
    !req.query.status ||
    !req.query.studentYear ||
    !req.query.div ||
    !req.query.branch ||
    !req.query.isApprovedByAdmin
  ) {
    // console("parameters are not valid");
    return res.send({
      status: "failed",
      msg: "Please provide valid parameters",
    });
  }
  try {
    const student = await studentModel.findOne({ _id: req.query.studentId });
    if (!student) {
      // console("wrong student id");
      return res.send({ status: "failed", msg: "Invalid Student" });
    }
  } catch (error) {
    // console("error in student id");
    return res.send({
      status: "failed",
      msg: "Invalid Student, Something is fishy here",
    });
  }
  try {
    const projects = await projectModel
      .find({
        students: req.query.studentId,
        year: parseInt(req.query.year),
        sem: parseInt(req.query.sem),
        subject: req.query.subject,
        isApproved: req.query.status === "true" ? true : false,
        studentYear : req.query.studentYear,
        div: req.query.div,
        branch: req.query.branch,
        isApprovedByAdmin: req.query.isApprovedByAdmin === "true" ? true : false
      })
      .populate("students");
      // console("pending projects **************");
      // console(projects);
    if (!projects || projects.length < 1) {
      // console("unable to find projects");
      return res.send({ status: "failed", msg: "No pending projects found" });
    }
    return res.send({ status: "success", projects });
  } catch (error) {
    // console("error in finding projects***********");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Unable to find pending projects",
    });
  }
};

// get all students approved projects

const getAllStudentsApprovedProjects = async (req, res) => {
  // console("in get all approved projects");
  try {
    const student = await studentModel.findOne({ _id: req.query.studentId });
    if (!student) {
      // console("student not found");
      return res.send({ status: "failed", msg: "Invalid Student" });
    }
  } catch (error) {
    // console("error in student id");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Invalid Student. Something is wrong. Try again later",
    });
  }

  try {
    const projects = await projectModel
      .find({ students: req.query.studentId })
      .populate("students");
    if (!projects) {
      // console("no projects found");
      return res.send({ status: "failed", msg: "No projects found" });
    }
    // console("projects found", projects);
    return res.send({ status: "success", projects });
  } catch (error) {
    // console("error while finding projects");
    return res.send({ status: "failed", msg: "Unable to find projects" });
  }
};

// add task

const addTask = async (req, res) => {
  // console("in add task");
  // console("data ", req.body);
  if (!req.body.task || !req.body.date || !req.body.week) {
    // console("task not found");
    return res.send({
      status: "failed",
      msg: "Provide all the required parameters to add",
    });
  }
  let project;
  try {
    project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Invalid project. Try again with valid project",
      });
    }
  } catch (error) {
    // console("error while finding project");
    return res.send({ status: "failed", msg: "Invalid project" });
  }

  try {
    const updatedProject = await projectModel
      .findOneAndUpdate(
        { _id: req.body.projectId },
        {
          $set: {
            tasks: project.tasks
              ? [
                  ...project.tasks,
                  {
                    task: req.body.task,
                    date: req.body.date,
                    week: req.body.week,
                  },
                ]
              : [
                  {
                    task: req.body.task,
                    date: req.body.date,
                    week: req.body.week,
                  },
                ],
          },
        },
        { new: true }
      )
      .populate("students");
    if (!updatedProject) {
      // console("not updated");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to add task. Try again later",
      });
    }
    // console("task added");
    return res.send({ status: "success", project: updatedProject });
  } catch (error) {
    // console("error while updating");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Something went wrong. Try again later",
    });
  }
};

// upload project ppt

const uploadPPT = async (req, res) => {
  // console("In upload ppt");
  if (!req.body.ppt) {
    // console("ppt is not attached");
    return res.send({
      status: "failed",
      msg: "Unable to upload the ppt. Try again.",
    });
  }
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId, isApproved:true });
    if (!project) {
      // console("invalid project id");
      return res.send({ status: "failed", msg: "Project is not approved." });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Invalid project id. Something is fishy here",
    });
  }

  try {
    const project = await projectModel
      .findOneAndUpdate(
        { _id: req.body.projectId },
        { $set: { ppt: req.body.ppt } },
        { new: true }
      )
      .populate("students")
      .populate("marks.studentId");
    if (!project) {
      // console("not uploaded");
      return res.send({ status: "failed", msg: "Unable to upload ppt" });
    }
    // console("uploaded");
    return res.send({ status: "success", project });
  } catch (error) {
    // console("error while uploading");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error while uploading. Try again later",
    });
  }
};

// upload literature review
const literatureReview = async (req, res) => {
  // console("In lit review");
  if (!req.body.literatureReview) {
    // console("file is not attached");
    return res.send({
      status: "failed",
      msg: "Please attach valid literature review ",
    });
  }
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId, isApproved:true  });
    if (!project) {
      // console("invalid project id");
      return res.send({ status: "failed", msg: "Project is not approved." });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Invalid project id. Something is fishy here",
    });
  }

  try {
    const project = await projectModel
      .findOneAndUpdate(
        { _id: req.body.projectId },
        { $set: { literatureReview: req.body.literatureReview } }
      )
      .populate("students")
      .populate("marks.studentId");
    if (!project) {
      // console("not uploaded");
      return res.send(
        {
          status: "failed",
          msg: "Unable to upload literature review",
        },
        { new: true }
      );
    }
    // console("uploaded");
    return res.send({ status: "success", project });
  } catch (error) {
    // console("error while uploading");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error while uploading. Try again later",
    });
  }
};
// upload project report
const uploadReport = async (req, res) => {
  // console("In report ppt");
  // console("body ", req.body);
  if (!req.body.report) {
    // console("file is not attached");
    return res.send({ status: "failed", msg: "Please attach valid report " });
  }
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId, isApproved:true  });
    if (!project) {
      // console("invalid project id");
      return res.send({ status: "failed", msg: "Project is not approved."});
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Invalid project id. Something is fishy here",
    });
  }

  try {
    const project = await projectModel
      .findOneAndUpdate(
        { _id: req.body.projectId },
        { $set: { report: req.body.report } },
        { new: true }
      )
      .populate("students")
      .populate("marks.studentId");
    if (!project) {
      // console("not uploaded");
      return res.send({ status: "failed", msg: "Unable to upload report" });
    }
    // console("uploaded");
    return res.send({ status: "success", project });
  } catch (error) {
    // console("error while uploading");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error while uploading. Try again later",
    });
  }
};

// update task
// const updateTask = async (req, res) => {
//   // console("In update task");
//   // console("req.body ", req.body);
//   if (req.body.task && req.body.task.isCompleted) {
//     // console("task is approved/complete so can not edit it");
//     return res.send({
//       status: "failed",
//       msg: "Task is already approved. So can not edit it now.",
//     });
//   }
//   try {
//     const project = await projectModel.findOne({ _id: req.body.projectId });
//     if (!project) {
//       // console("project not found");
//       return res.send({
//         status: "failed",
//         msg: "Unable to find project. Invalid Project",
//       });
//     }
//   } catch (error) {
//     // console("error while finding project");
//     return res.send({
//       status: "failed",
//       msg: "Something is wrong. Invalid Project. Try again later",
//     });
//   }

//   try {
//     const task = await projectModel.findOne({
//       _id: req.body.projectId,
//       "tasks._id": req.body.taskId,
//       "task.isCompleted": false,
//     });
//     if (!task) {
//       // console("unable to find task");
//       return res.send({
//         status: "failed",
//         msg: "Unable to find task. Something is wrong",
//       });
//     }
//   } catch (error) {
//     // console("invalid task id");
//     return res.send({ status: "failed", msg: "Invalid task. Try again later" });
//   }

//   try {
//     const updateTask = await projectModel.findOneAndUpdate(
//       { _id: req.body.projectId, "tasks._id": req.body.taskId },
//       { $set: { "tasks.$.task": req.body.task.task } },
//       { new: true }
//     );
//     if (!updateTask) {
//       // console("task not updated");
//       return res.send({
//         status: "failed",
//         msg: "Unable to update task. Try again later",
//       });
//     }
//     // console("task updated");
//     return res.send({ status: "success" });
//   } catch (error) {
//     // console("error while updating");
//     // console(error);
//     return res.send({
//       status: "failed",
//       msg: "Something went wrong while updating task. Try again later",
//     });
//   }
// };

// TEACHERS PART *****************************

// get all pending projects
// const getAllPendingProjects = async (req, res) => {
//   // console("getting all pending projects");
//   try {
//     const teacher = await teacherModel.findOne({ _id: req.query.teacherId });
//     if (!teacher) {
//       // console("teacher not found");
//       return res.send({ status: "failed", msg: "Invalid Teacher Id" });
//     }
//   } catch (error) {
//     // console("error while finding teacher", error);
//     return res.send({ status: "failed", msg: "Invalid Teacher Id" });
//   }

//   try {
//     var allProjects = await projectModel
//       .find({ isApproved: false, projectHead: req.query.teacherId })
//       .populate("students");
//     if (!allProjects) {
//       // console("No projects found");
//       return res.send({ status: "failed", msg: "No result found" });
//     }

//     // console("all projects ", allProjects);
//     res.send({ status: "success", allPendingProjects: allProjects });
//   } catch (error) {
//     // console("error while finding project");
//     return res.send({ status: "failed", msg: "Please provide valid data" });
//   }
// };
// // get all approved projects
// const getAllApprovedProjects = async (req, res) => {
//   // console("getting all approved projects");
//   try {
//     const teacher = await teacherModel.findOne({ _id: req.query.teacherId });
//     if (!teacher) {
//       // console("teacher not found");
//       return res.send({ status: "failed", msg: "Invalid Teacher Id" });
//     }
//   } catch (error) {
//     // console("error while finding teacher", error);
//     return res.send({ status: "failed", msg: "Invalid Teacher Id" });
//   }

//   const allProjects = await projectModel
//     .find({ isApproved: true, projectHead: req.query.teacherId })
//     .populate("students");
//   // console("all projects ", allProjects);
//   res.send({ status: "success", allApprovedProjects: allProjects });
// };

// add teachers remark

const addRemark = async (req, res) => {
  // console("In add remark");

  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Project Id is invalid",
      });
    }
  } catch (error) {
    // console("invalid project id");
    return res.send({
      status: "failed",
      msg: "Server Error. Project Id is invalid.",
    });
  }

  const project = await projectModel
    .findOneAndUpdate(
      { _id: req.body.projectId },
      {
        $set: {
          comments: req.body.remark,
        },
      },
      { new: true }
    )
    .populate("students");

  if (!project) {
    // console("error while updating project");
    return res.send({
      status: "failed",
      msg: "Server Error, Can not add comment",
    });
  }

  return res.send({ status: "success", project });
};

// approve project
const approveProject = async (req, res) => {
  // console("In approve project part");
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Couldn't find the project",
      });
    }
  } catch (error) {
    // console("invalid project id");
    return res.send({
      status: "failed",
      msg: "Provided project is invalid, Try again later.",
    });
  }
  const project = await projectModel.findOneAndUpdate(
    { _id: req.body.projectId },
    {
      $set: {
        isApproved: true,
      },
    },
    { new: true }
  );
  if (!project) {
    // console("Unable to update project status");
    return res.send({
      status: "failed",
      msg: "Server Error. Unable to update project status",
    });
  }

  // console("project added");
  return res.send({ status: "success", msg: "Project updated", project });
};






// add task Marks
const addTaskMarks = async (req, res) => {
  // console("In add task marks");
  // console("body is ");
  // console(req.body);
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Project. Something is wrong",
      });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Project is invalid. Try again later",
    });
  }
  try {
    const task = await projectModel.findOne({
      _id: req.body.projectId,
      "tasks._id": req.body.taskId,
    });
    if (!task) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Task. Something is wrong",
      });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Task is invalid. Try again later",
    });
  }
  try {
    const updateTask = await projectModel
      .findOneAndUpdate(
        { _id: req.body.projectId, "tasks._id": req.body.taskId },
        { $set: { "tasks.$.marks": req.body.marks } },
        { new: true }
      )
      .populate("students");
    if (!updateTask) {
      // console("error while updating");
      return res.send({
        status: "failed",
        msg: "Unable to update task status. Try again later",
      });
    }
    // console("task updated");
    // console("tasks are");
    // console(updateTask.tasks);
    return res.send({ status: "success", project: updateTask });
  } catch (error) {
    // console("error while updating");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server error while updating task. Try again later.",
    });
  }
};

// Add task remark
const addTaskRemark = async (req, res) => {
  // console("In add task remark");
  // console("body is ");
  // console(req.body);
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Project. Something is wrong",
      });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Project is invalid. Try again later",
    });
  }
  try {
    const task = await projectModel.findOne({
      _id: req.body.projectId,
      "tasks._id": req.body.taskId,
    });
    if (!task) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Task. Something is wrong",
      });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Task is invalid. Try again later",
    });
  }
  try {
    const updateTask = await projectModel
      .findOneAndUpdate(
        { _id: req.body.projectId, "tasks._id": req.body.taskId },
        { $set: { "tasks.$.remark": req.body.remark } },
        { new: true }
      )
      .populate("students");
    if (!updateTask) {
      // console("error while updating");
      return res.send({
        status: "failed",
        msg: "Unable to update task status. Try again later",
      });
    }
    // console("task updated");
    // console("tasks are");
    // console(updateTask.tasks);
    return res.send({ status: "success", project: updateTask });
  } catch (error) {
    // console("error while updating");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server error while updating task. Try again later.",
    });
  }
};

// update project title and abstract

const updateProject = async (req, res) => {
  // console("In update title part");
  if (!req.body.title || !req.body.abstract) {
    // console("title or abstract is absent");
    return res.send({
      status: "failed",
      msg: "Please provide valid Title and Abstract",
    });
  }
  try {
    var project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({ status: "failed", msg: "Project not found" });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({ status: "failed", msg: "Invalid Project" });
  }
  try {
    project = await projectModel
      .findOneAndUpdate(
        { _id: req.body.projectId },
        { title: req.body.title, abstract: req.body.abstract },
        { new: true }
      )
      .populate("students")
      .populate("marks.studentId");
    if (!project) {
      // console("not updated");
      return res.send({ status: "failed", msg: "Project Not updated." });
    }
  } catch (error) {
    // console("error while updating the project");
    return res.send({
      status: "failed",
      msg: "Unable to update the project. Try again later.",
    });
  }
  // console("title updated");
  // console(project);
  return res.send({ status: "success", project: project });
};

// update title by student

const updateProjectTitleByStudent = async (req, res) => {
  // console("In update title part");
  if (!req.body.title) {
    // console("title  is absent");
    return res.send({
      status: "failed",
      msg: "Please provide valid Title and Abstract",
    });
  }
  try {
    var project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({ status: "failed", msg: "Project not found" });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({ status: "failed", msg: "Invalid Project" });
  }
  if (project.isApproved || project.isApprovedByAdmin) {
    // console("project is approved");
    return res.send({
      status: "failed",
      msg: "Project is approved. You dont have permission to edit. Ask the respective faculty",
    });
  }
  try {
    project = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId },
      { title: req.body.title }
    );
    if (!project) {
      // console("not updated");
      return res.send({ status: "failed", msg: "Project Not updated." });
    }
  } catch (error) {
    // console("error while updating the project");
    return res.send({
      status: "failed",
      msg: "Unable to update the project. Try again later.",
    });
  }
  // console("title updated");
  // console(project);
  return res.send({ status: "success", project: project });
};

// update project abstract by the student
const updateProjectAbstractByStudent = async (req, res) => {
  // console("In update abstract part");
  if (!req.body.abstract) {
    // console("title or abstract is absent");
    return res.send({
      status: "failed",
      msg: "Please provide valid Title and Abstract",
    });
  }
  try {
    var project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({ status: "failed", msg: "Project not found" });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({ status: "failed", msg: "Invalid Project" });
  }
  if (project.isApproved || project.isApprovedByAdmin) {
    // console("project is approved");
    return res.send({
      status: "failed",
      msg: "Project is approved. You dont have permission to edit. Ask the respective faculty",
    });
  }
  try {
    project = await projectModel.findOneAndUpdate(
      { _id: req.body.projectId },
      { abstract: req.body.abstract }
    );
    if (!project) {
      // console("not updated");
      return res.send({ status: "failed", msg: "Project Not updated." });
    }
  } catch (error) {
    // console("error while updating the project");
    return res.send({
      status: "failed",
      msg: "Unable to update the project. Try again later.",
    });
  }
  // console("title updated");
  // console(project);
  return res.send({ status: "success", project: project });
};

// Change task status
const updateTaskStatus = async (req, res) => {
  // console("In update task status");
  try {
    const project = await projectModel.findOne({ _id: req.body.projectId });
    if (!project) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Project. Something is wrong",
      });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Project is invalid. Try again later",
    });
  }
  try {
    const task = await projectModel.findOne({
      _id: req.body.projectId,
      "tasks._id": req.body.taskId,
    });
    if (!task) {
      // console("project not found");
      return res.send({
        status: "failed",
        msg: "Server Error. Unable to find Task. Something is wrong",
      });
    }
  } catch (error) {
    // console("error while finding project");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server Error. Task is invalid. Try again later",
    });
  }
  try {
    const updateTask = await projectModel
      .findOneAndUpdate(
        { _id: req.body.projectId, "tasks._id": req.body.taskId },
        { $set: { "tasks.$.isCompleted": true } },
        { new: true }
      )
      .populate("students");
    if (!updateTask) {
      // console("error while updating");
      return res.send({
        status: "failed",
        msg: "Unable to update task status. Try again later",
      });
    }
    // console("task updated");
    return res.send({ status: "success", project: updateTask });
  } catch (error) {
    // console("error while updating");
    // console(error);
    return res.send({
      status: "failed",
      msg: "Server error while updating task. Try again later.",
    });
  }
};

// Query part
// const filterStudents = async (req, res) => {
//   // console("filtering students");
//   const year = ["FY", "SY", "TY", "FINAL"];
//   const branch = ["ET", "CS", "IT", "MECH", "INST", "CH"];
//   const div = ["A", "B", "C", "D", "E"];
//   if (
//     !req.query.year ||
//     !req.query.branch ||
//     !req.query.div ||
//     !year.includes(req.query.year) ||
//     !div.includes(req.query.div) ||
//     !branch.includes(req.query.branch)
//   ) {
//     // console("div or branch not found");
//     return res.send({
//       status: "failed",
//       msg: "Please select requested fields. Do not send incomplete data",
//     });
//   }
//   // try {
//   //   const projects = await
//   // } catch (error) {

//   // }
// };

//students routes
router.post("/add", studentsAuth, addProject);
router.get(
  "/get-all-pending-projects",
  studentsAuth,
  getAllStudentsPendingProjects
);
router.get(
  "/get-students-approved-projects",
  studentsAuth,
  getAllStudentsApprovedProjects
);
router.patch(
  "/student-update-project-title",
  studentsAuth,
  updateProjectTitleByStudent
);
router.patch(
  "/student-update-project-abstract",
  studentsAuth,
  updateProjectAbstractByStudent
);
// router.patch("/update-task", studentsAuth, updateTask);
router.patch("/upload-ppt", studentsAuth, uploadPPT);
router.patch("/upload-report", studentsAuth, uploadReport);
router.patch(
  "/upload-literature-review",
  studentsAuth,
  literatureReview
);

// teachers routes
// router.get("/get-all-pending-projects", teacherAuth, getAllPendingProjects);
// router.get("/get-all-approved-projects", teacherAuth, getAllApprovedProjects);
router.patch("/add-task", teacherAuth, addTask);
router.patch("/addRemark", teacherAuth, addRemark);
router.patch("/approve-project", teacherAuth, approveProject);
router.patch("/update-project", teacherAuth, updateProject);
router.patch("/update-task-status", teacherAuth, updateTaskStatus);
router.patch("/add-task-remark", teacherAuth, addTaskRemark);
router.patch("/add-task-marks", teacherAuth, addTaskMarks);

module.exports = router;
