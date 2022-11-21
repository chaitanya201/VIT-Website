import { DataGrid } from "@material-ui/data-grid";
import React, { useState } from "react";
// import { useCookies } from "react-cookie";
import { useLocation, useRoutes } from "react-router";
import ClosingAlert from "../Auth/Alert";
// import EditCell from "../Teachers/EditCell";
import TaskApproveCell from "./TaskApproveCell";
import view from "../../Images/view.png";
import { saveAs } from "file-saver";
import axios from "axios";
import { useCookies } from "react-cookie";
import Select from "react-select";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
// import AddMarks from "./AddMarks";

export default function ShowSingleProject() {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const [alertColor, setAlertColor] = useState("red");
  const [alertMsg, setAlertMsg] = useState(null);
  try {
    var { project } = location.state;
    // console.log("first project is ");
    // console.log(project);
  } catch (error) {
    console.log("erorr is ");
    console.log(error);

    // this below code is causing infinite re-rendering.
    // source : https://namespaceit.com/blog/uncaught-error-too-many-re-renders-react-limits-the-number-of-renders-to-prevent-an-infinite-loop
    // source : https://bobbyhadz.com/blog/react-too-many-re-renders-react-limits-the-number

    // setAlertColor("red");
    // setAlertMsg("Project not found. Please follow the valid steps.");
  }
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newProject, setNewProject] = useState(project);
  const [task, setTask] = useState("");
  const [remark, setRemark] = useState("");
  const [cookies] = useCookies();
  const [week, setWeek] = useState({ label: "Week 1", value: 1 });
  const [title, setTitle] = useState(project ? project.title : "");
  const [abstract, setAbstract] = useState(project ? project.abstract : "");
  const [showTitle, setShowTitle] = useState(false);
  const [showAbstract, setShowAbstract] = useState(false);
  const weekOptions = [
    { label: "Week 1", value: 1 },
    { label: "Week 2", value: 2 },
    { label: "Week 3", value: 3 },
    { label: "Week 4", value: 4 },
    { label: "Week 5", value: 5 },
    { label: "Week 6", value: 6 },
    { label: "Week 7", value: 7 },
    { label: "Week 8", value: 8 },
  ];
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };
  const [marks, setMarks] = useState("");
  const url = "http://localhost:5000";

  if (!project) {
    return (
      <div className="bg-red-500">
        Visit this page through proper steps only
      </div>
    );
  }

  var pptColor = project.ppt ? "green-400" : "white";
  var reportColor = project.report ? "green-400" : "white";
  var litReviewColor = project.literatureReview ? "green-400" : "white";
  // console.log(" new project is ", newProject);

  const formSubmit = async (e) => {
    e.preventDefault();
    setShowAbstract(!showAbstract);
    setShowTitle(!showTitle);
    console.log("in form");
    if (title.length < 4) {
      setAlertMsg("title should be at least 4 characters");
      setAlertColor("red");
      return;
    }
    if (abstract.split(" ").length < 15) {
      setAlertMsg("abstract should be at least 15 words");
      setAlertColor("red");
      return;
    }

    const newProject = { title, abstract, projectId: project._id };
    try {
      const response = await axios.patch(
        `${url}/projects/update-project?teacherId=${user ? user._id : "12"}`,
        newProject,
        { headers }
      );
      console.log("res--", response.data);
      if (response.data.status !== "success") {
        setAlertMsg(response.data.msg);
        setAlertColor("red");
      } else {
        setNewProject(response.data.project);
        setAlertMsg("Project Updated");
        setAlertColor("green");
      }
    } catch (error) {
      setAlertMsg("Server Error. Try again later");
      setAlertColor("red");
    }
  };

  var columns = [
    {
      field: "task",
      headerName: "Task",
      width: "300",
      align: "left",
    },
    {
      field: "week",
      headerName: "Week",
      width: "300",
      align: "left",
    },
    {
      field: "date",
      headerName: "Date",
      width: "300",
      align: "left",
    },
    {
      field: "isCompleted",
      headerName: "Status",
      width: "300",
      renderCell: (params) => {
        return (
          <TaskApproveCell
            project={newProject}
            setAlertColor={setAlertColor}
            setAlertMsg={setAlertMsg}
            setNewProject={setNewProject}
            task={params.row}
          ></TaskApproveCell>
        );
      },

      align: "center",
    },
    {
      field: "remark",
      headerName: "Teachers Remark",
      width: "300",
      align: "center",
    },
    {
      field: "marks",
      headerName: "Marks",
      width: "300",
      align: "center",
      // editable: true,
      // renderEditCell: (params) => {
      //   // console.log("edited************", params.row.marks);
      //   return (
      //     <div>
      //       <AddMarks
      //         setNewProject={setNewProject}
      //         project={newProject}
      //         setAlertMsg={setAlertMsg}
      //         setAlertColor={setAlertColor}
      //         task={params.row}
      //       ></AddMarks>
      //     </div>
      //   );
      // },
      // renderCell: ({ row }) => {
      //   return <div>{row.marks}</div>;
      // },
    },
  ];
  // console.log("state", showTitle);
  return (
    <div>
      <div>
        {alertMsg ? (
          <ClosingAlert alertColor={alertColor} msg={alertMsg}></ClosingAlert>
        ) : (
          <span></span>
        )}
      </div>
      <div className="bg-slate-200">
        <div className="text-center">
          <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
            <label className="uppercase font-bold text-lg">Title</label>
            <h1 className="text-3xl  font-serif">{newProject.title}</h1>
            {!showTitle ? (
              <button
                onClick={() => {
                  setShowTitle(!showTitle);
                }}
                className="relative inline-block px-4 py-2 font-medium group"
              >
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
                <span className="relative text-green-400 group-hover:text-white">
                  Edit Title
                </span>
              </button>
            ) : (
              <div>
                <form className="flex" onSubmit={formSubmit}>
                  <div className="w-full py-4 px-3 ">
                    <input
                      className="w-full h-10"
                      type="text"
                      required
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>
                  <div className="relative inline-flex items-center justify-center p-4 px-6 py-4 mt-3 overflow-hidden h-11 font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group">
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                      <input type="submit" value={"Change Title"} />
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                      <input type="submit" value={"Change Title"} />
                    </span>
                    <span className="relative invisible">
                      <input type="submit" value={"Change Title"} />
                    </span>
                  </div>
                </form>
                <div>
                  <button
                    onClick={() => {
                      setShowTitle(!showTitle);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
            <label className="uppercase font-bold text-xl">Abstract</label>
            <h1 className="text-xl  font-serif">{newProject.abstract}</h1>
            {!showAbstract ? (
              <button
                onClick={() => {
                  setShowAbstract(!showAbstract);
                }}
                className="relative inline-block px-4 py-2 font-medium group"
              >
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
                <span className="relative text-teal-700 group-hover:text-white">
                  Edit Abstract
                </span>
              </button>
            ) : (
              <div>
                <form className="flex-col" onSubmit={formSubmit}>
                  <div className="w-full py-4 px-3 ">
                    <textarea
                      cols="100"
                      rows="10"
                      value={abstract}
                      className="border-2 border-black"
                      onChange={(e) => {
                        setAbstract(e.target.value);
                      }}
                    >
                      {" "}
                    </textarea>
                  </div>
                  <div className="relative inline-flex items-center justify-center p-4 px-6 py-4 mt-3 overflow-hidden h-11 font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group">
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                      <input type="submit" value={"Change Abstract"} />
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                      <input type="submit" value={"Change Abstract"} />
                    </span>
                    <span className="relative invisible">
                      <input type="submit" value={"Change Abstract"} />
                    </span>
                  </div>
                </form>
                <div>
                  <button
                    onClick={() => {
                      setShowAbstract(!showAbstract);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <div>
              <label className="text-6xl">Documents</label>
            </div>
            <div className=" ">
              <div
                className={`bg-white rounded-xl shadow-lg grid flex-col md:grid  md:grid-cols-2 lg:grid lg:grid-cols-3   md:space-x-7 sm:flex-col  overflow-hidden sm:m-10`}
              >
                <div
                  className={`flex-col space-x-0 py-9 px-9  bg-white m-20 rounded-xl shadow-md xl:w-60 xl:flex-col lg:w-60 md:w-60 sm:w-60 bg-${pptColor} `}
                >
                  <div className="py-3">
                    {newProject.ppt ? (
                      <div>
                        <img
                          src={view}
                          alt="Loading"
                          onClick={() => {
                            saveAs(newProject.ppt, newProject.ppt);
                          }}
                        />
                        <label>PPT</label>
                      </div>
                    ) : (
                      <span>NA</span>
                    )}
                  </div>
                </div>
                <div
                  className={`flex-col  space-x-0 py-9 px-9 bg-${reportColor} m-20 rounded-xl shadow-md xl:w-60 lg:w-60 md:w-60 sm:w-60`}
                >
                  <div className="py-3">
                    {newProject.report ? (
                      <div>
                        <img
                          src={view}
                          alt="Loading"
                          onClick={() => {
                            saveAs(newProject.report, newProject.report);
                          }}
                        />
                        <label>Report</label>
                      </div>
                    ) : (
                      <span>NA</span>
                    )}
                  </div>
                </div>
                <div
                  className={`flex-col lg:col-start-3 md:col-start-2 py-9 px-9 bg-${litReviewColor} m-20 rounded-xl shadow-md xl:w-60 lg:w-60 md:w-60 sm:w-60`}
                >
                  <div className="py-3">
                    {newProject.literatureReview ? (
                      <div>
                        <img
                          src={view}
                          alt="Loading"
                          onClick={() => {
                            saveAs(
                              newProject.literatureReview,
                              newProject.literatureReview
                            );
                          }}
                        />
                        <label>Literature Review</label>
                      </div>
                    ) : (
                      <span>NA</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white m-20 rounded-xl shadow-lg py-9">
            <div className="ml-32 mr-32 bg-cyan-400">
              <h1 className="uppercase font-serif">Group Members </h1>
            </div>
            <div className="text-center">
              {newProject.students.map((student) => {
                return (
                  <div key={student._id} className={" px-10 py-3"}>
                    <div className="flex place-content-center space-x-10">
                      <div>{student.name}</div>
                      <div>{student.email}</div>
                      <div>{student.grNo}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="py-3 m-10">
        <DataGrid
          rows={newProject.tasks}
          columns={columns}
          getRowId={(data) => data._id}
          autoHeight
          checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            setSelectedTaskId(newSelectionModel[newSelectionModel.length - 1]);
            console.log(
              "selection",
              newSelectionModel[newSelectionModel.length - 1]
            );
          }}
          rowHeight={400}
        ></DataGrid>
      </div>
      <div className="py-3 bg-slate-300 flex justify-center rounded-lg shadow-lg">
        <div>
          <div className="uppercase text-xl py-3"> Add Task</div>
          <div className="py-4 bg-white rounded-md">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                console.log("inf ");
                const date = new Date();
                const day = date.getDate();
                const month = date.getMonth();
                const year = date.getFullYear();
                console.log("day", day, " ", "month ", month, " year ", year);
                if (task.length < 4) return;

                try {
                  const response = await axios.patch(
                    `${url}/projects/add-task?teacherId=${
                      user ? user._id : "12"
                    }`,
                    {
                      task: task,
                      projectId: project._id,
                      date: day + "/" + month + "/" + year,
                      week: week.value,
                    },
                    { headers }
                  );
                  if (response.data.status === "success") {
                    console.log("task added..");
                    setAlertColor("green");
                    setAlertMsg("Task Added");
                    setNewProject(response.data.project);
                  } else {
                    console.log("not added");
                    setAlertColor("red");
                    setAlertMsg(response.data.msg);
                  }
                } catch (error) {
                  console.log("server error");
                  console.log(error);
                }
              }}
            >
              <div className="py-3">
                <Select
                  options={weekOptions}
                  value={week}
                  onChange={(e) => setWeek({ label: e.label, value: e.value })}
                ></Select>
              </div>
              <div>
                <textarea
                  className="border-2 border-blue-500 border-solid "
                  cols="30"
                  required
                  rows="10"
                  placeholder="Add new task here..."
                  value={task}
                  onChange={(e) => {
                    setTask(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className="relative flex justify-center px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                <div className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">
                  <input type="submit" value={"ADD"} />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="m-2">
          <div className="uppercase text-xl py-3 m-2 max-w-full">
            {" "}
            Add Task Marks
          </div>
          <div className="py-4 bg-white rounded-md">
            <form
              className=""
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await axios.patch(
                    `${url}/projects/add-task-marks?teacherId=${
                      user ? user._id : "12"
                    }`,
                    {
                      marks: marks,
                      projectId: project._id,
                      taskId: selectedTaskId,
                    },
                    { headers }
                  );
                  console.log("000", response.data);
                  if (response.data.status !== "success") {
                    setAlertMsg(response.data.msg);
                    setAlertColor("red");
                  } else {
                    setAlertMsg("Marks added");
                    setAlertColor("green");
                    setNewProject(response.data.project);
                  }
                } catch (error) {
                  setAlertColor("red");
                  setAlertMsg("Server Error. Try again later.");
                }
              }}
            >
              <div className="p-2">
                <input
                  className=" outline outline-black"
                  type="number"
                  value={marks}
                  required
                  onChange={(e) => {
                    setMarks(e.target.valueAsNumber);
                  }}
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="submit"
                  value={"Add marks"}
                  className="bg-green-500 p-2 rounded-md "
                />
              </div>
            </form>
          </div>
        </div>
        <div className="m-2">
          <div className="uppercase text-xl py-3 m-2 max-w-full">
            {" "}
            Add Task Remark
          </div>
          <div className="py-4 bg-white rounded-md">
            <form
              className=""
              onSubmit={async (e) => {
                e.preventDefault();
                if (!selectedTaskId) {
                  setAlertColor("Select task");
                  setAlertColor("red");
                  return;
                }
                // console.log("in takskflaj ");
                try {
                  const response = await axios.patch(
                    `${url}/projects/add-task-remark?teacherId=${
                      user ? user._id : "12"
                    }`,
                    {
                      remark: remark,
                      projectId: project._id,
                      taskId: selectedTaskId,
                    },
                    { headers }
                  );
                  console.log("000", response.data);
                  if (response.data.status !== "success") {
                    setAlertMsg(response.data.msg);
                    setAlertColor("red");
                  } else {
                    setAlertMsg("Remark added");
                    setAlertColor("green");
                    setNewProject(response.data.project);
                  }
                } catch (error) {
                  setAlertColor("red");
                  setAlertMsg("Server Error. Try again later.");
                }
              }}
            >
              <div className="p-2">
                <textarea
                  placeholder="Add task remark.."
                  cols="30"
                  rows="10"
                  value={remark}
                  required
                  onChange={(e) => {
                    setRemark(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className="flex justify-center">
                <input
                  type="submit"
                  value={"Add"}
                  className="bg-green-500 p-2 rounded-md "
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
