const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  // projectId: {
  //   type: String,
  //   required: true,
  // },
  year: {
    type: 'Number',
    default: new Date().getFullYear(),
  },
  studentYear: 'String',
  div: {
    type: 'String',
    required: true,
  },
  branch: {
    type: 'String',
    required: true,
  },
  projectHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherData",
  },
  adminRemark: {
    type: 'String',
    default: "NA",
  },
  isApprovedByAdmin: {
    type: 'Boolean',
    default: false,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },
  ],

  marks: [
    {
      midSem: {
        problemStatement: {type: 'Number', default: 0},
        literatureReview: {type: 'Number', default: 0},
        groupFormation: {type: 'Number', default: 0},
        objective: {type: 'Number', default: 0},
        knowledgeOfDomain: {type: 'Number', default: 0},
        totalConverted: {type: 'Number', default: 0},
      },
      endSem: {
        projectRealization: {type: 'Number', default: 0},
        projectDesignAndTesting: {type: 'Number', default: 0},
        reportWriting: {type: 'Number', default: 0},
        QualityOfWork: {type: 'Number', default: 0},
        performanceInAssessment: {type: 'Number', default: 0},
        timelyCompletion: {type: 'Number', default: 0},
        totalConverted: {type: 'Number', default: 0},
      },
      total: "Number",
      studentId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "UserData",
      }
    },
  ],
  isGroupProject: {
    type: 'Boolean',
    default: false,
  },
  title: {
    type: 'String',
    required: true,
  },
  abstract: {
    type: 'String',
    required: true,
  },
  subject: {
    type: 'String',
    required: true,
  },
  isApproved: {
    type: 'Boolean',
    default: false,
  },
  sem: {
    type: Number,
    default: 1,
  },
  // duration: {
  //   type: Number,
  //   required: true,
  // },
  tasks: [
    {
      task: {
        type: String,
        required: true,
      },
      remark: {
        type: String,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
      marks: {
        type: Number,
        default: 0,
      },
      week: {
        type: Number,
      },
      date: {
        type: String,
      },
    },
  ],
  report: {
    type: String,
  },
  ppt: String,
  literatureReview: String,
  comments: {
    type: String,
    default: "NA",
  },
});

const projectModel = new mongoose.model("Projects", projectSchema);

module.exports = projectModel;
