// import { InputLabel } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { saveAs } from "file-saver";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
// import EditCell from "./EditCell";
import view from "../../Images/view.png";
import axios from "axios";
import { useCookies } from "react-cookie";
import ClosingAlert from "../Auth/Alert";
import { Button } from "@material-ui/core";
import { storage } from "../../firebaseStorage/firebaseConfiguration";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useSelector } from "react-redux";

export default function ShowSingleProject() {
  const location = useLocation();
  const [alertColor, setAlertColor] = useState("red");
  const user = useSelector((state) => state.user.user);
  const [alertMsg, setAlertMsg] = useState(null);
  console.log("app location data = ", location.state)
  try {
    var { project } = location.state;
  } catch (error) {
    // setAlertColor('red')
    // setAlertMsg("Please Visit this page through valid path only. Dont visit this page directly.")
    // return <div>Please Visit this page through valid path only. Dont visit this page directly.</div>
  }

  const [ppt, setPpt] = useState("");

  const [report, setReport] = useState("");
  const [updatedProject, setUpdatedProject] = useState(project);
  const [literatureReview, setLiteratureReview] = useState("");
  // const [task, setTask] = useState("");
  const [cookies] = useCookies();

  const [pptColor, setPptColor] = useState(
    project && project.ppt ? "green-400" : "white"
  );
  const [reportColor, setReportColor] = useState(
    project && project.report ? "green-400" : "white"
  );
  const [litReviewColor, setLitReviewColor] = useState(
    project && project.literatureReview ? "green-400" : "white"
  );

  // if no project is selected then show warning on page.
  if (!project) {
    return (
      <div className="bg-red-500" data-testid = 'error'>
        Please visit this place through proper order only.
      </div>
    );
  }
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };
  console.log("ppt name ", ppt);
  // ppt

  const uploadPPT = async (e) => {
    e.preventDefault();
    if (!ppt) {
      setAlertColor("red");
      setAlertMsg("Select ppt");
      return;
    }
    const pptName = v4() + ppt.name;
    const pptReference = ref(storage, `ProjectDocuments/PPT/${pptName}`);

    // uploading image to firebase.

    try {
      const uploadppt = await uploadBytes(pptReference, ppt);
      if (!uploadppt) {
        setAlertColor("red");
        setAlertMsg("Unable to upload the ppt");
        return;
      }
      const url = await getDownloadURL(pptReference);
      if (!url) {
        console.log("url not foundwr");
        setAlertColor("red");
        setAlertMsg("Unable to upload the ppt");
        return;
      }
      console.log("uploaded ppt");
      console.log(uploadppt);
      console.log("ppt url ");
      console.log(url);
      // console.log("uploaded image ", uploadppt);
      const response = await axios.patch(
        `http://localhost:5000/projects/upload-ppt?studentId=${
          user ? user._id : "123"
        }`,
        { ppt: url, projectId: updatedProject._id },
        { headers }
      );
      if (response.data.status !== "success") {
        setAlertMsg(response.data.msg);
        setPptColor("red-400");
      } else {
        setUpdatedProject(response.data.project);
        setPpt("");
        setAlertMsg(null);
        setPptColor("green-400");
        setAlertColor("green");
      }
    } catch (error) {
      console.log("failed to upload the image");
      setAlertColor("red");
      setAlertMsg("Failed to upload to the PPT. Try again.");
    }
  };

  // report
  const uploadReport = async (e) => {
    e.preventDefault();
    if (!report) {
      setAlertColor("red");
      setAlertMsg("Select Report");
      return;
    }

    // upload report to firebase
    const reportName = v4() + report.name;
    const reportReference = ref(
      storage,
      `ProjectDocuments/Report/${reportName}`
    );
    console.log("report name");
    console.log(reportName);
    try {
      const uploadreport = await uploadBytes(reportReference, report);
      if (!uploadreport) {
        setAlertColor("red");
        setAlertMsg("Unable to upload the report");
        return;
      }
      console.log("uploaded report");
      console.log(uploadreport);
      const url = await getDownloadURL(reportReference);
      if (!url) {
        console.log("url not foundwr");
        setAlertColor("red");
        setAlertMsg("Unable to upload the Report");
        return;
      }
      console.log("report url");
      console.log(url);
      const response = await axios.patch(
        `http://localhost:5000/projects/upload-report?studentId=${
          user ? user._id : "123"
        }`,
        { report: url, projectId: updatedProject._id },
        { headers }
      );
      if (response.data.status !== "success") {
        setAlertMsg(response.data.msg);
        setReportColor("red-400");
        setAlertColor("red");
      } else {
        setUpdatedProject(response.data.project);
        setReport("");
        setAlertMsg(null);
        setReportColor("green-400");
        setAlertColor("green");
      }
    } catch (error) {
      setAlertMsg("Server error. Try again later");
      setAlertColor("red");
    }
  };
  console.log("project is ", updatedProject);

  // literature review
  const uploadLiteratureReview = async (e) => {
    e.preventDefault();
    if (!literatureReview) {
      setAlertColor("red");
      setAlertMsg("Select Report");
      return;
    }

    // upload report to firebase
    const litrptName = v4() + literatureReview.name;
    const litrptReference = ref(
      storage,
      `ProjectDocuments/LiteratureReview/${litrptName}`
    );

    try {
      const uploadLiterature = await uploadBytes(
        litrptReference,
        literatureReview
      );
      console.log("uploaded literature review");
      console.log(uploadLiterature);
      if (!uploadLiterature) {
        setAlertColor("red");
        setAlertMsg("Unable to upload the report");
        return;
      }
      console.log("literature review url");
      const url = await getDownloadURL(litrptReference);
      if (!url) {
        console.log("url not foundwr");
        setAlertColor("red");
        setAlertMsg("Unable to upload the Report");
        return;
      }
      console.log(url);

      const response = await axios.patch(
        `http://localhost:5000/projects/upload-literature-review?studentId=${
          user ? user._id : "123"
        }`,
        { literatureReview: url, projectId: updatedProject._id },
        { headers }
      );
      if (response.data.status !== "success") {
        setAlertMsg(response.data.msg);
        setLitReviewColor("red-400");
        setAlertColor("red");
      } else {
        setUpdatedProject(response.data.project);
        setLiteratureReview("");
        setAlertMsg(null);
        setLitReviewColor("green-400");
        setAlertColor("green");
      }
    } catch (error) {
      setAlertMsg("Server error. Try again later");
      setAlertColor("red");
    }
  };

  console.log("location is ", location);
  const taskCols = [
    {
      field: "task",
      headerName: "Task",
      width: "300",
      align: "left",
      // editable: true,
      // renderEditCell: (params) => {
      //   return (
      //     <div>
      //       <EditCell
      //         row={params.row}
      //         project={updatedProject}
      //         setAlertMsg={setAlertMsg}
      //       ></EditCell>
      //     </div>
      //   );
      // },
    },
    {
      field: "isCompleted",
      headerName: "Status",
      width: "300",
      renderCell: ({ row }) => {
        const value = row.isCompleted ? "Completed" : "Pending";
        const color = row.isCompleted ? "limegreen" : "yellow";
        return (
          <div>
            <Button style={{ backgroundColor: `${color}` }}>{value}</Button>
          </div>
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
      width: "150",
      align: "center",
    },
  ];
  return (
    <>
      <div>
        {alertMsg ? (
          <ClosingAlert msg={alertMsg} alertColor={alertColor}></ClosingAlert>
        ) : (
          <span></span>
        )}
      </div>
      {updatedProject ? (
        <div className="bg-slate-200" data-testid="single-project">
          <div className="text-center">
            <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
              <label className="uppercase font-bold text-2xl">Title</label>
              <h1 className="text-4xl  font-serif">{updatedProject.title}</h1>
            </div>
            <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
              <label className="uppercase font-bold text-lg">Abstract</label>
              <h1 className="text-xl  font-serif">{updatedProject.abstract}</h1>
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
                      {updatedProject.ppt ? (
                        <div>
                          <img
                            src={view}
                            alt="Loading"
                            onClick={() => {
                              saveAs(updatedProject.ppt, updatedProject.ppt);
                            }}
                          />
                        </div>
                      ) : (
                        <span>NA</span>
                      )}
                    </div>
                    <div>
                      <form onSubmit={uploadPPT}>
                        <div>
                          <input
                            type="file"
                            required
                            onChange={(e) => {
                              setPpt(e.target.files[0]);
                              if (ppt.size > 5000000) {
                                setAlertMsg(
                                  "Size of the ppt should be less than 5 MB"
                                );
                                setAlertColor("red");
                                setPpt("");
                              }
                            }}
                          />
                        </div>
                        <div>
                          <input type="submit" value={"upload PPT"} />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div
                    className={`flex-col  space-x-0 py-9 px-9 bg-${reportColor} m-20 rounded-xl shadow-md xl:w-60 lg:w-60 md:w-60 sm:w-60`}
                  >
                    <div className="py-3">
                      {updatedProject.report ? (
                        <div>
                          <img
                            src={view}
                            alt="Loading"
                            onClick={() => {
                              saveAs(
                                updatedProject.report,
                                updatedProject.report
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <span>NA</span>
                      )}
                    </div>
                    <div>
                      <form onSubmit={uploadReport}>
                        <div>
                          <input
                            type="file"
                            required
                            onChange={(e) => {
                              setReport(e.target.files[0]);
                            }}
                          />
                        </div>
                        <div>
                          <input type="submit" value={"upload Report"} />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div
                    className={`flex-col lg:col-start-3 md:col-start-2 py-9 px-9 bg-${litReviewColor} m-20 rounded-xl shadow-md xl:w-60 lg:w-60 md:w-60 sm:w-60`}
                  >
                    <div className="py-3">
                      {updatedProject.literatureReview ? (
                        <div>
                          <img
                            src={view}
                            alt="Loading"
                            onClick={() => {
                              saveAs(
                                updatedProject.literatureReview,
                                updatedProject.literatureReview
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <span>NA</span>
                      )}
                    </div>
                    <div>
                      <form onSubmit={uploadLiteratureReview}>
                        <div>
                          <input
                            type="file"
                            required
                            onChange={(e) => {
                              setLiteratureReview(e.target.files[0]);
                            }}
                          />
                        </div>
                        <div>
                          <input
                            type="submit"
                            value={"upload Literature Review"}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white m-20 rounded-xl shadow-lg">
              <div className="ml-32 mr-32 bg-cyan-400">
                <h1 className="uppercase font-serif">Group Members </h1>
              </div>
              <div className="text-center">
                {updatedProject.students.map((student) => {
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

          <div className="bg-white m-10 rounded-xl">
            <div className="w-full h-full">
              <DataGrid
                autoHeight
                rowHeight={400}
                rows={updatedProject.tasks}
                columns={taskCols}
                getRowId={(data) => data._id}
              ></DataGrid>
            </div>
          </div>
        </div>
      ) : (
        <span data-testid="not-found-single-project">No Project found</span>
      )}

      {/* <div className="bg-slate-200">
        <div className="text-center">
          <label className="uppercase font-mono text-4xl">New Task</label>
        </div>
        <div className=" ml-32 mr-32 bg-white rounded-2xl w-80  ">
          <form
            className=""
            onSubmit={async (e) => {
              e.preventDefault();
              if (task.length < 4) {
                setAlertMsg("Task should be greater than 4 characters");
                setAlertColor("red-400");
              }

              try {
                const response = await axios.patch(
                  "http://localhost:5000/projects/add-task",
                  { task, projectId: project._id },
                  { headers }
                );
                console.log("res ==", response.data);
                if (response.data.status !== "success") {
                  setAlertMsg(response.data.msg);
                  setAlertColor("red");
                } else {
                  setTask("");
                  setUpdatedProject(response.data.project);
                  setAlertMsg("Task Added");
                  setAlertColor("green");
                }
              } catch (error) {
                setAlertMsg("Server Error. try again later");
                setAlertColor("red");
              }
            }}
          >
            <div>
              <textarea
                className="w-full border-separate"
                value={task}
                onChange={(e) => {
                  setTask(e.target.value);
                }}
                placeholder="Add task"
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="py-4 bg-orange-400">
              <div className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group">
              <input type="submit" value={"Add"} />
                
                
              </div>
            </div>
          </form>
        </div>
      </div> */}
    </>
  );
}
