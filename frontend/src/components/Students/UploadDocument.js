import { Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { saveAs } from "file-saver";
import view from "../../Images/view.png";
import { DataGrid } from "@material-ui/data-grid";
import ClosingAlert from "../Auth/Alert";

export default function UploadDocument() {
  const [alertMsg, setAlertMsg] = useState(null);
  const [approvedProjects, setApprovedProjects] = useState(null);
  const [cookies] = useCookies();
  // // // console.log("approved projects", approvedProjects);
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };
  // // // console.log("approved projects ", approvedProjects);
  const getAllApprovedProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/projects/get-students-approved-projects?studentId=" +
          cookies.user._id,
        { headers }
      );
      // // // console.log("res ", response.data.projects);
      if (response.data.status === "failed") {
        setAlertMsg(response.data.msg);
      } else {
        setApprovedProjects(response.data.projects);
      }
    } catch (error) {
      setAlertMsg("Server Error. Unable to get projects");
    }
  };

  // // // console.log("view is ", view);

  useEffect(() => {
    getAllApprovedProjects();
  }, []);

  const columns = [
    {
      field: "title",
      headerName: "Title",
      minWidth: 500,
      flex: 1,
    },

    {
      field: "subject",
      headerName: "Subject",
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
      field: "ppt",
      headerName: "PPT",
      renderCell: (params) => {
        return (
          <div>
            {params.row.ppt ? (
              <div>
                <img
                  src={view}
                  alt="View"
                  onClick={() => {
                    saveAs(params.row.ppt, params.row.ppt);
                  }}
                />
              </div>
            ) : (
              <span>NA</span>
            )}
          </div>
        );
      },
    },
    {
      field: "report",
      headerName: "Report",
      renderCell: (params) => {
        return (
          <div>
            {params.row.report ? (
              <img
                src={view}
                alt="View"
                onClick={() => {
                  saveAs(params.row.report, params.row.report);
                }}
              />
            ) : (
              <span>NA</span>
            )}
          </div>
        );
      },
    },
    {
      field: "literatureReview",
      headerName: "Literature Review",
      renderCell: (params) => {
        // // // console.log("review ", params.row.literatureReview);
        return (
          <div>
            {params.row.literatureReview ? (
              <img
                src={view}
                alt="View"
                onClick={() => {
                  saveAs(
                    params.row.literatureReview,
                    params.row.literatureReview
                  );
                }}
              />
            ) : (
              <span>NA</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div>
        {alertMsg ? (
          <ClosingAlert alertColor={"red"} msg={alertMsg} />
        ) : (
          <span></span>
        )}
      </div>
      <div>
        {approvedProjects ? (
          <DataGrid
            autoHeight
            columns={columns}
            rowHeight={300}
            rows={approvedProjects}
            getRowId={(data) => data._id}
          ></DataGrid>
        ) : (
          <span>No Projects Found</span>
        )}
      </div>
    </div>
  );
}
