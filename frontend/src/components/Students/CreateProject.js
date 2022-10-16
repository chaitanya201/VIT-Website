import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import Select from "react-select";
import ClosingAlert from "../Auth/Alert";
// import AddGroupMembers from "./AddGroupMembers";
export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [sem, setSem] = useState({ value: 1, label: "Sem 1" });
  const [projectHead, setProjectHead] = useState("");
  const [abstract, setAbstract] = useState("");
  const [subject, setSubject] = useState({
    value: "operatingSystem",
    label: "Operating System",
  });
  const [year, setYear] = useState({
    value: "firstYear",
    label: "First Year",
  });
  const [div, setDiv] = useState({ label: "A", value: "A" });
  const [branch, setBranch] = useState({
    label: "Computer Science",
    value: "computerScience",
  });
  const [alertMsg, setAlertMsg] = useState(null);
  // const [project.totalNoOfGroupMembers, project.setTotalNoOfGroupMembers] = useState(2);
  const [validTitle, setValidTitle] = useState(true);
  // const [continueButton, setContinueButton] = useState(false);
  const [validAbstract, setValidAbstract] = useState(true);
  const [alertColor, setAlertColor] = useState("red");
  // const [groupMembersEmail, setGroupMembersEmail] = useState([]);
  const [showGroupProject, setShowGroupProject] = useState(false);
  const [cookie] = useCookies();
  const branchOptions = [
    {
      label: "Electronics And Telecommunications",
      value: "electronicsAndTelecommunications",
    },
    { label: "Computer Science", value: "computerScience" },
    { label: "Chemical Engineering", value: "chemicalEngineering" },
    { label: "Mechanical Engineering", value: "mechanicalEngineering" },
    { label: "Instrumentation", value: "instrumentation" },
    { label: "Artificial Intelligence", value: "artificialIntelligence" },
  ];
  const yearOptions = [
    { label: "First Year", value: "firstYear" },
    { label: "Second Year", value: "secondYear" },
    { label: "Third Year", value: "thirdYear" },
    { label: "Final Year", value: "finalYear" },
  ];
  const divOptions = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "E", value: "E" },
  ];
  const options = [
    { value: "operatingSystem", label: "Operating System" },
    { value: "dataScience", label: "Data Science" },
    { value: "signalProcessing", label: "Signal Processing" },
    { value: "sdp", label: "SDP" },
    { value: "computerVision", label: "Computer Vision" },
  ];
  // // // console.log("subject is ", subject);
  // // // console.log("show gp ", showGroupProject);
  const titleChange = (e) => {
    if (e.target.value.trim().length < 5) {
      setValidTitle(false);
      setAlertMsg("Title should be at least 5 characters");
      return;
    }

    setValidTitle(true);
    setAlertMsg(null);
    setTitle(e.target.value.trim());
  };

  const [teamMate1, setTeamMate1] = useState("");
  const [teamMate2, setTeamMate2] = useState("");
  const [teamMate3, setTeamMate3] = useState("");
  const [teamMate4, setTeamMate4] = useState("");
  const [teamMate5, setTeamMate5] = useState("");
  // // // console.log("show gp ", showGroupProject);
  let isGroupProject = false;
  const user = useSelector((state) => state.user.user);
  // // // console.log("user is ", user);
  // form submit function
  const onFormSubmit = async (e) => {
    e.preventDefault();
    // // // console.log("in form submit");
    if (!validAbstract || !validTitle) return;

    const project = {
      title,
      abstract,
      subject: subject.value,
      projectHead,
      studentId: user ? user._id : "",
      sem: sem.value,
      year: year.value,
      div: div.value,
      branch: branch.value,
    };

    project.groupMembers = [user ? user.email : ""];
    if (teamMate1.length !== 0) {
      isGroupProject = true;
      if (!project.groupMembers.includes(teamMate1))
        project.groupMembers.push(teamMate1);
      if (teamMate2.length !== 0 && !project.groupMembers.includes(teamMate2))
        project.groupMembers.push(teamMate2);
      if (teamMate3.length !== 0 && !project.groupMembers.includes(teamMate3))
        project.groupMembers.push(teamMate3);
      if (teamMate4.length !== 0 && !project.groupMembers.includes(teamMate4))
        project.groupMembers.push(teamMate4);
      if (teamMate5.length !== 0 && !project.groupMembers.includes(teamMate5))
        project.groupMembers.push(teamMate5);
    }

    project.isGroupProject = isGroupProject;

    const headers = {
      authorization: "Bearer " + cookie.token,
      "Access-Control-Allow-Origin": "*",
    };

    try {
      // const response = await axios.post(
      //   "http://localhost:5000/projects/add?studentId=" + user ? user._id : "",
      //   project,
      //   { headers }
      // );
      const response = await axios.post(
        `http://localhost:5000/projects/add?studentId=${
          user ? user._id : "123"
        }`,
        project,
        { headers }
      );
      if (response.data.status === "success") {
        setAlertMsg("Project Created Successfully");
        setAlertColor("green");
      } else {
        setAlertColor("red");
        setAlertMsg(response.data.msg);
      }
    } catch (error) {
      // // // console.log("error in server");
      // // // console.log(error)
      setAlertMsg("Server Error");
    }
  };

  // // // console.log("teammate type ", typeof teamMate1);
  return (
    <div className=" bg-slate-50    " data-testid="create-project">
      {alertMsg ? (
        <ClosingAlert msg={alertMsg} alertColor={alertColor} />
      ) : (
        <div></div>
      )}
      <div className=" pb-10 py-2 px-10 sm:max-w-[100%] md:max-w-3xl ">
        <div className="text-center text-xl py-2">
          <h1>Create New Project</h1>
        </div>
        <form
          method="post"
          onSubmit={onFormSubmit}
          className=" bg-slate-100 border-double shadow-lg rounded-lg relative  "
        >
          <div className="p-3">
            <input
              className="px-8  w-full border rounded py-2 text-gray-700 focus:outline-none items-center"
              // className="rounded-md focus:ring focus:outline-none focus:outline-blue-600 focus:rounded text-center block w-full"
              type="text"
              required
              placeholder="title"
              onChange={titleChange}
            />
          </div>
          <div className="p-3">
            <textarea
              className="px-8  w-full border rounded py-2 text-gray-700 focus:outline-none focus:outline-blue-600 items-center"
              required
              placeholder="Abstract  min 100 words"
              cols="50"
              rows="10"
              onChange={(e) => {
                if (e.target.value.trim().split(" ").length < 5) {
                  setValidAbstract(false);
                  setAlertMsg("less words");
                  return;
                }
                setValidAbstract(true);
                setAlertMsg(null);
                setAbstract(e.target.value.trim());
              }}
            ></textarea>
          </div>
          <div className="p-3">
            <Select
              value={subject}
              options={options}
              onChange={(e) => {
                setSubject({ label: e.label, value: e.value });
              }}
            ></Select>
          </div>
          <div className="p-3">
            <Select
              value={year}
              options={yearOptions}
              onChange={(e) => {
                setYear({ label: e.label, value: e.value });
              }}
            ></Select>
          </div>
          <div className="p-3">
            <Select
              value={branch}
              options={branchOptions}
              onChange={(e) => {
                setBranch({ label: e.label, value: e.value });
              }}
            ></Select>
          </div>
          <div className="p-3">
            <Select
              value={div}
              options={divOptions}
              onChange={(e) => {
                setDiv({ label: e.label, value: e.value });
              }}
            ></Select>
          </div>
          <div className="p-3">
            <Select
              value={sem}
              onChange={(e) => {
                setSem({ label: e.label, value: e.value });
              }}
              options={[
                { value: 1, label: "Sem 1" },
                { value: 2, label: "Sem 2" },
              ]}
            />
          </div>
          <div>
            <div>
              {/* {!showGroupProject ? (
              <div>
                <button onClick={() => {
                    // // // console.log("this function has called.")
                    setShowGroupProject((preState) => !preState)
                }}>
                  IsGroup project
                </button>
              </div>
            ) : (
              <div>
                {!continueButton ? (
                  <div>
                    <input
                      type="number"
                      value={project.totalNoOfGroupMembers}
                      placeholder="Enter total no of Group members"
                      onChange={(e) => {
                        project.setTotalNoOfGroupMembers(e.target.valueAsNumber);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        setContinueButton(!continueButton);
                      }}
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <div>
                    {project.totalNoOfGroupMembers !== 1
                      ? [...Array(project.totalNoOfGroupMembers)].map((val) => {
                          return (
                            <div key={val}>
                              <project.AddGroupMembers
                                project.setGroupMembersEmail={project.setGroupMembersEmail}
                                project.groupMembersEmail={project.groupMembersEmail}
                              />
                            </div>
                          );
                        })
                      : setShowGroupProject((preState) => !preState)}
                    <div>
                      <button
                        onClick={(e) => {
                          setContinueButton(!continueButton);
                        }}
                      >
                        back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )} */}
            </div>
            <div className="p-3">
              {!showGroupProject ? (
                <>
                  <button
                    onClick={() => {
                      setShowGroupProject((preState) => !preState);
                    }}
                    className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
                  >
                    <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                      Group Project
                    </span>
                  </button>
                </>
              ) : (
                <div className="p-3">
                  <div className="p-3">
                    <input
                      type="email"
                      className="px-8  w-full border rounded py-2 text-gray-700 focus:outline-none focus:outline-blue-600 items-center"
                      placeholder="Enter Team Mate no 1 Email Id"
                      required
                      onChange={(e) => {
                        setTeamMate1(e.target.value);
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <input
                      className="px-8  w-full border rounded py-2 text-gray-700 focus:outline-none focus:outline-blue-600 items-center"
                      type="email"
                      placeholder="Enter Team Mate no 2 Email Id"
                      onChange={(e) => {
                        setTeamMate2(e.target.value);
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <input
                      className="px-8  w-full border rounded py-2 text-gray-700 focus:outline-none focus:outline-blue-600 items-center"
                      type="email"
                      placeholder="Enter Team Mate no 3 Email Id"
                      onChange={(e) => {
                        setTeamMate3(e.target.value);
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <input
                      className="px-8  w-full border rounded py-2 text-gray-700 focus:outline-none focus:outline-blue-600 items-center"
                      type="email"
                      placeholder="Enter Team Mate no 4 Email Id"
                      onChange={(e) => {
                        setTeamMate4(e.target.value);
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <input
                      className="px-8  w-full border rounded py-2 text-gray-700 focus:outline-none focus:outline-blue-600 items-center"
                      type="email"
                      placeholder="Enter Team Mate no 5 Email Id"
                      onChange={(e) => {
                        setTeamMate5(e.target.value);
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <button
                      onClick={() => {
                        setShowGroupProject((preState) => !preState);
                      }}
                      className="px-5 py-2.5 font-medium bg-blue-50 hover:bg-blue-100 hover:text-blue-600 text-blue-500 rounded-lg text-sm"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-3">
            <input
              className="px-8  w-full border rounded py-2 text-gray-700 focus:outline-none focus:outline-blue-600 items-center"
              type="email"
              required
              placeholder="Teachers Email"
              onChange={(e) => {
                setProjectHead(e.target.value);
              }}
            />
          </div>
          <div className="p-3">
            <div className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
              <span className="relative">
                <input type="submit" value={"Create Project"} />
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
