import { Button, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import ClosingAlert from "../Auth/Alert";
import SelectQuery from "../Teachers/SelectQuery";

export default function ShowProjects() {
  const [cookies] = useCookies();
  const [allProjects, setAllProjects] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  // const [task, setTask] = useState("");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [alertColor, setAlertColor] = useState("red");
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };
  const year = useSelector(
    (state) => state.teacherSelectQuery.teacherSelectQuery.projectYear
  );
  const div = useSelector(
    (state) => state.teacherSelectQuery.teacherSelectQuery.div
  );
  const studentYear = useSelector(
    (state) => state.teacherSelectQuery.teacherSelectQuery.studentYear
  );
  const studentBranch = useSelector(
    (state) => state.teacherSelectQuery.teacherSelectQuery.studentBranch
  );
  const sem = useSelector(
    (state) => state.teacherSelectQuery.teacherSelectQuery.sem
  );
  const subject = useSelector(
    (state) => state.teacherSelectQuery.teacherSelectQuery.subject
  );
  const isApproved = useSelector(
    (state) => state.teacherSelectQuery.teacherSelectQuery.isApproved
  );
  const isApprovedByAdmin = useSelector(
    (state) => state.teacherSelectQuery.teacherSelectQuery.isApprovedByAdmin
  );

  const getAllProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/projects/get-all-pending-projects?studentId=" +
          cookies.user._id +
          "&year=" +
          year.value +
          "&subject=" +
          subject.value +
          "&sem=" +
          sem.value +
          "&status=" +
          isApproved.value +
          "&studentYear=" +
          studentYear.value +
          "&div=" +
          div.value +
          "&branch=" +
          studentBranch.value +
          "&isApprovedByAdmin=" +
          isApprovedByAdmin.value,
        { headers }
      );
      // // // console.log("response is  .. ", response.data);
      if (response.data.status === "success") {
        setAllProjects(response.data.projects);
        setAlertColor("green");
        setAlertMsg("Projects Found");
      } else {
        setAllProjects(null);
        setAlertMsg(response.data.msg);
        setAlertColor("red");
      }
    } catch (error) {
      setAlertMsg("Server Error. Try again later");
    }
  };

  // useEffects
  useEffect(() => {
    getAllProjects();
  }, []);

  const columns = [
    {
      field: "title",
      headerName: "Title",
      minWidth: 500,
      flex: 1,
    },

    {
      field: "abstract",
      headerName: "Abstract",
      minWidth: 150,
      flex: 3,
    },
    {
      field: "sem",
      headerName: "Semester",
      width: 150,
    },
    {
      field: "students.name",
      headerName: "Name",
      minWith: 500,
      width: 300,
      // minHeight:300,
      renderCell: (params) => {
        // // // console.log("params are ", params);
        return (
          <div className="w-full space-y-1">
            {params.row.students.map((val) => {
              return (
                <div id={val._id}>
                  <Typography align="center">{val.name}</Typography>
                  <hr />
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      field: "students.email",
      headerName: "Email",
      width: 250,
      // height:100,
      renderCell: (params) => {
        return (
          <div className="flex-col overflow-y-auto space-y-1 w-full">
            {params.row.students.map((val) => {
              return (
                <div key={val._id} className=" ">
                  <Typography align="center">{val.email}</Typography>
                  <hr />
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      field: "isApproved",
      headerName: "Guide Status",
      renderCell: ({ row }) => {
        const color = row.isApproved ? "green" : "yellow";
        const value = row.isApproved ? "Approved" : "Pending";
        return (
          <div key={row._id}>
            <Button style={{ backgroundColor: `${color}` }}>{value}</Button>
          </div>
        );
      },
    },
    {
      field: "comments",
      headerName: "Guide Remark",
    },
    {
      field: "isApproveByAdmin",
      headerName: "Admin Status",
      renderCell: ({ row }) => {
        const color = row.isApprovedByAdmin ? "greenyellow" : "yellow";
        const value = row.isApprovedByAdmin ? "Approved" : "Pending";
        return (
          <div key={row._id}>
            <Button style={{ backgroundColor: `${color}` }}>{value}</Button>
          </div>
        );
      },
    },
    {
      field: "adminRemark",
      headerName: "Admin Remark",
    },
  ];

  return (
    <div>
      <div>
        {alertMsg ? (
          <ClosingAlert msg={alertMsg} alertColor={alertColor}></ClosingAlert>
        ) : (
          <span></span>
        )}
      </div>

      <div>
        <SelectQuery getAllApprovedProjects={getAllProjects}></SelectQuery>
      </div>

      <div>
        {allProjects ? (
          <div>
            <DataGrid
              rows={allProjects}
              autoHeight
              columns={columns}
              getRowId={(data) => data._id}
              rowHeight={200}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                setSelectedProjectId(
                  newSelectionModel[newSelectionModel.length - 1]
                );
                // // // console.log(
                //   "selection",
                //   newSelectionModel[newSelectionModel.length - 1]
                // );
              }}
              // selectionModel={true}
            ></DataGrid>
          </div>
        ) : (
          <span>No projects found</span>
        )}
      </div>
      {allProjects && allProjects.length > 0 ? (
        <div className="bg-slate-200 flex space-x-3 m-10 ">
          <div>
            {" "}
            <div className="text-left px-6 py-9">
              <label className="uppercase font-mono text-4xl">
                Change Title
              </label>
            </div>
            <div className=" ml-10 mr-32 bg-white rounded-2xl w-80  ">
              <form
                className=""
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selectedProjectId) {
                    setAlertColor("red");
                    setAlertMsg("Please Select project");
                    return;
                  }
                  if (title.length < 4) {
                    setAlertMsg("Title should be greater than 4 characters");
                    setAlertColor("red");
                  }

                  try {
                    const response = await axios.patch(
                      "http://localhost:5000/projects/student-update-project-title",
                      { title, projectId: selectedProjectId },
                      { headers }
                    );
                    // // // console.log("res ==", response.data);
                    if (response.data.status !== "success") {
                      setAlertMsg(response.data.msg);
                      setAlertColor("red");
                    } else {
                      setTitle("");
                      getAllProjects(response.data.project);
                      setAlertMsg("Title Updated");
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
                    value={title}
                    required
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    placeholder="Add Project Title"
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
          </div>
          <div>
            {" "}
            <div className="text-left px-6 py-9">
              <label className="uppercase font-mono text-4xl">
                Change Abstract
              </label>
            </div>
            {/* Abstract */}
            <div className=" ml-10 mr-32 bg-white rounded-2xl w-80  ">
              <form
                className=""
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selectedProjectId) {
                    setAlertColor("red");
                    setAlertMsg("Please Select project");
                    return;
                  }
                  if (abstract.length < 20) {
                    setAlertMsg(
                      "Abstract should be greater than 10 characters"
                    );
                    setAlertColor("red");
                  }

                  try {
                    const response = await axios.patch(
                      "http://localhost:5000/student-update-project-abstract",
                      { abstract, projectId: selectedProjectId },
                      { headers }
                    );
                    // // // console.log("res ==", response.data);
                    if (response.data.status !== "success") {
                      setAlertMsg(response.data.msg);
                      setAlertColor("red");
                    } else {
                      setAbstract("");
                      getAllProjects(response.data.project);
                      setAlertMsg("Abstract Updated");
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
                    value={abstract}
                    required
                    onChange={(e) => {
                      setAbstract(e.target.value);
                    }}
                    placeholder="Add Abstract"
                    cols="50"
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
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
