import { Button, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
// import reactSelect from "react-select";
import ClosingAlert from "../Auth/Alert";
import AdminApproveProjectCell from "./AdminApproveProjectCell";
import AdminQuerySelector from "./AdminQuerySelector";

export default function ShowTeachersProjects() {
  const location = useLocation();
  const [cookies] = useCookies();

  const [remark, setRemark] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const year = useSelector(
    (state) => state.adminSelectQuery.adminSelectQuery.projectYear
  );
  const div = useSelector(
    (state) => state.adminSelectQuery.adminSelectQuery.div
  );
  const studentYear = useSelector(
    (state) => state.adminSelectQuery.adminSelectQuery.studentYear
  );
  const studentBranch = useSelector(
    (state) => state.adminSelectQuery.adminSelectQuery.studentBranch
  );
  const sem = useSelector(
    (state) => state.adminSelectQuery.adminSelectQuery.sem
  );
  const subject = useSelector(
    (state) => state.adminSelectQuery.adminSelectQuery.subject
  );
  const isApproved = useSelector(
    (state) => state.adminSelectQuery.adminSelectQuery.isApproved
  );
  const isApprovedByAdmin = useSelector(
    (state) => state.adminSelectQuery.adminSelectQuery.isApprovedByAdmin
  );

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertMsgColor, setAlertMsgColor] = useState("red");

  const [allProjects, setAllProjects] = useState(null);
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };

  try {
    var { teacher } = location.state;
  } catch (error) {}
  const getTeachersProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/get-all-projects?teacherId=" +
          teacher._id +
          "&status=" +
          isApproved.value +
          "&subject=" +
          subject.value +
          "&year=" +
          year.value +
          "&sem=" +
          sem.value +
          "&isApprovedByAdmin=" +
          isApprovedByAdmin.value +
          "&studentYear=" +
          studentYear.value +
          "&div=" +
          div.value +
          "&branch=" +
          studentBranch.value,
        { headers }
      );
      console.log("res--", response.data);
      if (response.data.status === "success") {
        setAlertMsg("Projects found");
        setAlertMsgColor("green");
        setAllProjects(response.data.result);
      } else {
        setAlertMsg(response.data.msg);
        setAlertMsgColor("red");
      }
    } catch (error) {
      setAlertMsg("server error. Try again later");
      setAlertMsgColor("red");
    }
  };

  useEffect(() => {
    getTeachersProjects();
  }, []);
  if (!teacher) {
    return (
      <div className="bg-red-500 uppercase">
        Teacher is not selected. Please visit this page through proper steps
        only.
      </div>
    );
  }

  console.log("approved by admin", isApprovedByAdmin.value);

  // use effect

  const projectColumns = [
    { field: "title", headerName: "Title", width: 300 },
    { field: "abstract", headerName: "Abstract", width: 800, height: 500 },
    {
      field: "students.name",
      headerName: "Name",
      minWith: 500,
      width: 300,
      // minHeight:300,
      renderCell: (params) => {
        console.log("params are ", params);
        return (
          <div key={params.row.title} className="w-full space-y-1">
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
          <div
            key={params.row.abstract}
            className="flex-col overflow-y-auto space-y-1 w-full"
          >
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
      field: "sem",
      headerName: "View",
      width: 150,
      renderCell: ({ row }) => {
        return (
          <Button
            style={{ backgroundColor: "cyan" }}
            className="hover:bg-cyan-400"
          >
            {" "}
            <Link to={"/admin/show-single-project/"} state={{ project: row }}>
              View
            </Link>{" "}
          </Button>
        );
      },
    },
    {
      field: "isApproved",
      headerName: "Status (Teacher)",
      renderCell: ({ row }) => {
        return (
          <div key={row._id}>
            {row.isApproved ? (
              <Button style={{ backgroundColor: "limegreen" }}>Approved</Button>
            ) : (
              <Button style={{ backgroundColor: "yellow" }}>Pending</Button>
            )}
          </div>
        );
      },
    },
    {
      field: "isApprovedByAdmin",
      headerName: "Status (Admin)",
      renderCell: ({ row }) => {
        return (
          <div key={row._id}>
            <AdminApproveProjectCell
              getTeachersProjects={getTeachersProjects}
              row={row}
              setAlertMsgColor={setAlertMsgColor}
              setAlertMsg={setAlertMsg}
            ></AdminApproveProjectCell>
          </div>
        );
      },
    },
    {
      field: "adminRemark",
      headerName: "Remark",
      width: 300,
    },
  ];

  return (
    <div>
      <div>
        {alertMsg ? (
          <ClosingAlert
            msg={alertMsg}
            alertColor={alertMsgColor}
          ></ClosingAlert>
        ) : (
          <span></span>
        )}
      </div>
      <div>
        <AdminQuerySelector
          getTeachersProjects={getTeachersProjects}
        ></AdminQuerySelector>
      </div>
      <div>
        {allProjects ? (
          <div>
            <div>
              <DataGrid
                columns={projectColumns}
                rows={allProjects}
                getRowId={(data) => data._id}
                autoHeight
                rowHeight={"300"}
                // isRowSelectable={(params) => params.row.quantity > 500}
                checkboxSelection
                onSelectionModelChange={(newSelectionModel) => {
                  console.log("selection", newSelectionModel);
                  setSelectedProjectId(
                    newSelectionModel[newSelectionModel.length - 1]
                  );
                }}
                // selectionModel={true}
                // isRowSelectable={true}
              ></DataGrid>
            </div>
            <div className="bg-slate-200 flex justify-center py-6">
              <form
                className="bg-white rounded-xl"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selectedProjectId) {
                    setAlertMsg("Select project first");
                    setAlertMsgColor("red");
                    return;
                  }

                  try {
                    const response = await axios.patch(
                      "http://localhost:5000/admin/add-remark",
                      { remark, projectId: selectedProjectId },
                      { headers }
                    );
                    if (response.data.status === "success") {
                      getTeachersProjects();
                      setRemark("");
                    } else {
                      setAlertMsg(response.data.msg);
                      setAlertMsgColor("red");
                    }
                  } catch (error) {
                    setAlertMsg("Server Error. Try again later.");
                    setAlertMsgColor("red");
                  }
                }}
              >
                <div>
                  <textarea
                    placeholder="Add remark here..."
                    value={remark}
                    required
                    onChange={(e) => {
                      setRemark(e.target.value);
                    }}
                    cols="50"
                    rows="10"
                  ></textarea>
                </div>
                <div className="flex justify-center bg-pink-400 rounded-md h-10 ">
                  <input className=" w-full " type="submit" value={"ADD"} />
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>No projects found</div>
        )}
      </div>
      <div></div>
    </div>
  );
}
