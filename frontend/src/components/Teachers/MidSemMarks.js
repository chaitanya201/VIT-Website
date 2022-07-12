import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ClosingAlert from "../Auth/Alert";
import Select from "react-select";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

export default function MidSemMarks() {
  const location = useLocation();

  try {
    var { project } = location.state;
  } catch (error) {}
  // MID SEM MARKS Attributes
  const [problemStatement, setProblemStatement] = useState(2);
  const [literatureReview, setLiteratureReview] = useState(2);
  const [groupFormation, setGroupFormation] = useState(2);
  const [objective, setObjective] = useState(2);
  const [knowledgeOfDomain, setKnowledgeOfDomain] = useState(2);

  // END sem marks attribute

  const [projectRealization, setProjectRealization] = useState(2);
  const [projectDesignAndTesting, setProjectDesignAndTesting] = useState(2);
  const [reportWriting, setReportWriting] = useState(2);
  const [QualityOfWork, setQualityOfWork] = useState(2);
  const [performanceInAssessment, setPerformanceAssessment] = useState(2);
  const [timelyCompletion, setTimelyCompletion] = useState(2);

  // other states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [endSemSelectedStudent, setEndSemSelectedStudent] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertMsgColor, setAlertMsgColor] = useState("red");
  const [newProject, setNewProject] = useState(project);
  const user = useSelector((state) => state.user.user);
  const [cookies] = useCookies();

  const url = 'http://localhost:5000'


  if (!project) {
    return (
      <div className="bg-red-400">
        Visit this page through proper steps only
      </div>
    );
  }


  const studentOptions = [];
  for (let index = 0; index < project.marks.length; index++) {
    studentOptions.push({
      label: project.marks[index].studentId.email,
      value: project.marks[index].studentId._id,
    });
  }
  console.log("students options ", studentOptions);
  console.log("selected student", selectedStudent);
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };
  const addMidSemMarks = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setAlertMsg("Student not selected.");
      setAlertMsgColor("red");
      return;
    }
    try {
      const response = await axios.patch(
        `${url}/teacher/add-midsem-marks?teacherId=${
          user ? user._id : "12"
        }`,
        {
          problemStatement,
          literatureReview,
          groupFormation,
          objective,
          knowledgeOfDomain,
          studentId: selectedStudent,
          projectId: project._id,
        },
        { headers }
      );
      if (response.data.status === "success") {
        setAlertMsg("Marks Added");
        setAlertMsgColor("green");
        setProblemStatement(0);
        setLiteratureReview(0);
        setGroupFormation(0);
        setObjective(0);
        setKnowledgeOfDomain(0);
        setNewProject(response.data.project);
      } else {
        setAlertMsg(response.data.msg);
        setAlertMsgColor("red");
      }
    } catch (error) {
      setAlertMsg("Server Error. Try again later.");
      setAlertMsgColor("red");
    }
  };
  const addEndSemMarks = async (e) => {
    e.preventDefault();
    if (!endSemSelectedStudent) {
      setAlertMsg("Student not selected.");
      setAlertMsgColor("red");
      return;
    }
    try {
      const response = await axios.patch(
        `${url}/teacher/add-endsem-marks?teacherId=${
          user ? user._id : "12"
        }`,
        {
          projectRealization,
          projectDesignAndTesting,
          reportWriting,
          QualityOfWork,
          performanceInAssessment,
          timelyCompletion,
          studentId: endSemSelectedStudent,
          projectId: project._id,
        },
        { headers }
      );
      if (response.data.status === "success") {
        setAlertMsg("Marks Added");
        setAlertMsgColor("green");
        setProjectRealization(0);
        setProjectDesignAndTesting(0);
        setReportWriting(0);
        setQualityOfWork(0);
        setPerformanceAssessment(0);
        setTimelyCompletion(0);
        setNewProject(response.data.project);
      } else {
        setAlertMsg(response.data.msg);
        setAlertMsgColor("red");
      }
    } catch (error) {
      setAlertMsg("Server Error. Try again later.");
      setAlertMsgColor("red");
    }
  };
  console.log("sd statement type ", typeof problemStatement);
  console.log("sd statement type ", typeof literatureReview);

  return (
    <div>
      <div>
        {alertMsg ? (
          <ClosingAlert
            alertColor={alertMsgColor}
            msg={alertMsg}
          ></ClosingAlert>
        ) : (
          <span></span>
        )}
      </div>
      <div className="bg-slate-200">
        <div className="text-center">
          <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
            <label className="uppercase font-bold text-lg">Title</label>
            <h1 className="text-3xl  font-serif">{newProject.title}</h1>
          </div>
        </div>
        <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
          <label className="uppercase font-bold text-xl">Abstract</label>
          <h1 className="text-xl  font-serif">{newProject.abstract}</h1>
        </div>
        <div className="bg-white m-20 rounded-xl shadow-lg py-9">
          <div className="ml-32 mr-32 bg-cyan-400">
            <h1 className="uppercase font-serif">Group Members And Marks </h1>
          </div>
          <div className="text-center">
            {newProject.marks.map((student) => {
              return (
                <div key={student._id} className={" px-10 py-3"}>
                  <div className="bg-green-400 shadow-md rounded-lg place-content-center space-x-10 grid grid-cols-1 max-w-full  sm:grid sm:grid-cols-3">
                    <div className="max-w-full ">{student.studentId.name}</div>
                    <div>{student.studentId.email}</div>
                    <div>{student.studentId.grNo}</div>
                    <div>
                      <label htmlFor="alf">Mid Sem: </label>{" "}
                      {student.midSem.totalConverted}{" "}
                    </div>
                    <div>
                      <label htmlFor="alf">End Sem: </label>{" "}
                      {student.endSem.totalConverted}{" "}
                    </div>
                    <div>
                      <label htmlFor="alf">Total: </label> {student.total}{" "}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="uppercase font-bold text-xl flex justify-center">
          MID SEM MARKS
        </div>
        <div className="bg-white m-10 rounded-md shadow-md">
          <form onSubmit={addMidSemMarks}>
            <div className="p-10">
              <Select
                options={studentOptions}
                onChange={(e) => {
                  setSelectedStudent(e.value);
                }}
              ></Select>
            </div>
            <div className=" p-2 space-x-2  sm:grid sm:grid-cols-2 sm:gap-2 md:grid md:grid-cols-3 lg:grid lg:grid-cols-3 ">
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">
                    Selection Of Problem Statement
                  </label>
                </div>
                <input
                  className="max-w-full"
                  required
                  type="number"
                  value={problemStatement}
                  onChange={(e) => {
                    setProblemStatement(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">Literature Review</label>
                </div>
                <input
                  className=""
                  required
                  type="number"
                  value={literatureReview}
                  onChange={(e) => {
                    setLiteratureReview(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">
                    Group formation and identification of individual activity
                  </label>
                </div>
                <input
                  className=""
                  required
                  type="number"
                  value={groupFormation}
                  onChange={(e) => {
                    setGroupFormation(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">Objective of the project</label>
                </div>
                <input
                  className=""
                  required
                  type="number"
                  value={objective}
                  onChange={(e) => {
                    setObjective(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">
                    Knowledge of domain,technology used
                  </label>
                </div>
                <input
                  className=""
                  required
                  type="number"
                  value={knowledgeOfDomain}
                  onChange={(e) => {
                    setKnowledgeOfDomain(e.target.valueAsNumber);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center py-3">
              <div className="relative inline-flex items-center justify-center px-6 py-3 text-lg font-medium tracking-tighter text-white bg-gray-800 rounded-md group">
                <span class="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-purple-600 rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                <span class="absolute inset-0 w-full h-full bg-white rounded-md "></span>
                <span class="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-purple-600 rounded-md opacity-0 group-hover:opacity-100 "></span>
                <span class="relative text-purple-600 transition-colors duration-200 ease-in-out delay-100 group-hover:text-white">
                  <input type="submit" value={"ADD"} />
                </span>
              </div>
            </div>
          </form>
        </div>
        <div className="uppercase font-bold text-xl flex justify-center">
          END SEM MARKS
        </div>
        <div className="bg-white m-10 rounded-md shadow-md">
          <form onSubmit={addEndSemMarks}>
            <div className="p-10">
              <Select
                options={studentOptions}
                onChange={(e) => {
                  setEndSemSelectedStudent(e.value);
                }}
              ></Select>
            </div>
            <div className=" p-2 space-x-2  sm:grid sm:grid-cols-2 sm:gap-2 md:grid md:grid-cols-3 lg:grid lg:grid-cols-3 ">
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">
                    Selection Of Problem Statement
                  </label>
                </div>
                <input
                  className="max-w-full"
                  required
                  type="number"
                  value={projectRealization}
                  onChange={(e) => {
                    setProjectRealization(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">Literature Review</label>
                </div>
                <input
                  className=""
                  required
                  type="number"
                  value={projectDesignAndTesting}
                  onChange={(e) => {
                    setProjectDesignAndTesting(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">
                    Group formation and identification of individual activity
                  </label>
                </div>
                <input
                  className=""
                  required
                  type="number"
                  value={reportWriting}
                  onChange={(e) => {
                    setReportWriting(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">Objective of the project</label>
                </div>
                <input
                  className=""
                  required
                  type="number"
                  value={QualityOfWork}
                  onChange={(e) => {
                    setQualityOfWork(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">
                    Knowledge of domain,technology used
                  </label>
                </div>
                <input
                  className=""
                  required
                  type="number"
                  value={performanceInAssessment}
                  onChange={(e) => {
                    setPerformanceAssessment(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="bg-teal-300 rounded-md p-2 m-3">
                <div>
                  <label className="uppercase">
                    Knowledge of domain,technology used
                  </label>
                </div>
                <input
                  className=""
                  required
                  type="number"
                  value={timelyCompletion}
                  onChange={(e) => {
                    setTimelyCompletion(e.target.valueAsNumber);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center py-3">
              <div className="relative inline-flex items-center justify-center px-6 py-3 text-lg font-medium tracking-tighter text-white bg-gray-800 rounded-md group">
                <span class="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-purple-600 rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                <span class="absolute inset-0 w-full h-full bg-white rounded-md "></span>
                <span class="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-purple-600 rounded-md opacity-0 group-hover:opacity-100 "></span>
                <span class="relative text-purple-600 transition-colors duration-200 ease-in-out delay-100 group-hover:text-white">
                  <input type="submit" value={"ADD"} />
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
