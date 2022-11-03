import { Button, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import ClosingAlert from "../Auth/Alert";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
// import ShowAllPendingProjects from "../Projects/Teacher/ShowAllPendingProjects";
import ApproveProjectCell from "./ApproveProjectCell";
// import ProjectRemarkCell from "./ProjectRemarkCell";
import SelectQuery from "./SelectQuery";
import { useDispatch, useSelector } from "react-redux";

export default function ProjectApprovalRequests() {
  const [cookies] = useCookies();
  const user = useSelector((state) => state.user.user);
  const [allPendingProjects, setAllPendingProjects] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

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

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [alertColor, setAlertColor] = useState("red");
  const [remark, setRemark] = useState("");

  const url = 'http://localhost:5000'


  const addRemark = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setAlertColor("red");
      setAlertMsg("Select Project before adding remark.");
      return;
    }
    const headers = {
      authorization: "Bearer " + cookies.token,
      "Access-Control-Allow-Origin": "*",
    };
    try {
      const response = await axios.patch(
        `${url}/projects/addRemark?teacherId=${
          user ? user._id : "12"
        }`,
        { remark: remark.trim(), projectId: selectedProjectId },
        { headers }
      );
      if (response.data.status === "success") {
        setAlertMsg("Remark added");
        setAlertColor("green");
        getAllPendingProjects();
      } else {
        setAlertColor("red");
        setAlertMsg(response.data.msg);
      }
    } catch (error) {
      // // // console.log("errror");
      // // // console.log(error);
      setAlertColor("red");
      setAlertMsg("Server Problem. Try again later.");
    }
  };

  // // // console.log("student year", studentYear);

  // download end sem marks
  function exportSheet() {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    // format data in right order.
    let newData = [];
    for (let index = 0; index < allPendingProjects.length; index++) {
      let addObject = {
        Year: allPendingProjects[index].studentYear,
        Division: allPendingProjects[index].div,
        Branch: allPendingProjects[index].branch,
      };

      allPendingProjects[index].marks.map((project) => {
        addObject.subject = allPendingProjects[index].subject;

        addObject.Name = project.studentId.name;
        addObject.GrNo = project.studentId.grNo;
        addObject.Email = project.studentId.email;

        addObject.ProblemStatement = project.midSem.problemStatement;
        addObject.LiteratureReview = project.midSem.literatureReview;
        addObject.GroupFormation = project.midSem.groupFormation;
        addObject.Objective = project.midSem.objective;
        addObject.KnowledgeOfDomain = project.midSem.KnowledgeOfDomain;
        addObject.TotalMidSemMarks = project.midSem.totalConverted;
        addObject.ProjectRealization = project.endSem.projectRealization;
        addObject.ProjectDesignAndTesting =
          project.endSem.projectDesignAndTesting;
        addObject.ReportWriting = project.endSem.reportWriting;
        addObject.QualityOfWork = project.endSem.QualityOfWork;
        addObject.PerformanceInAssessment =
          project.endSem.performanceInAssessment;
        addObject.TimelyCompletion = project.endSem.timelyCompletion;
        addObject.totalMSEMarks = project.endSem.totalConverted;
        addObject.TotalMarksOfSemester = project.total;

        return newData.push(addObject);
      });
    }
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "End Sem Marks" + fileExtension);
  }

  // mid sem marks
  function midSemMarks() {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    // format data in right order.
    let newData = [];
    for (let index = 0; index < allPendingProjects.length; index++) {
      let addObject = {
        Year: allPendingProjects[index].studentYear,
        Division: allPendingProjects[index].div,
        Branch: allPendingProjects[index].branch,
      };

      allPendingProjects[index].marks.map((project) => {
        addObject.subject = allPendingProjects[index].subject;

        addObject.Name = project.studentId.name;
        addObject.GrNo = project.studentId.grNo;
        addObject.Email = project.studentId.email;

        addObject.ProblemStatement = project.midSem.problemStatement;
        addObject.LiteratureReview = project.midSem.literatureReview;
        addObject.GroupFormation = project.midSem.groupFormation;
        addObject.Objective = project.midSem.objective;
        addObject.KnowledgeOfDomain = project.midSem.KnowledgeOfDomain;
        addObject.TotalMidSemMarks = project.midSem.totalConverted;

        return newData.push(addObject);
      });
    }
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Mid Sem Marks" + fileExtension);
  }

  //  project status
  function exportProjectSheet() {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    // format data in right order.
    let newData = [];
    for (let index = 0; index < allPendingProjects.length; index++) {
      let addObject = {
        Year: allPendingProjects[index].studentYear,
        Division: allPendingProjects[index].div,
        Branch: allPendingProjects[index].branch,
      };

      allPendingProjects[index].marks.map((project) => {
        addObject.subject = allPendingProjects[index].subject;
        addObject.Title = allPendingProjects[index].title;
        addObject.Abstract = allPendingProjects[index].abstract;
        addObject.Name = project.studentId.name;
        addObject.GrNo = project.studentId.grNo;
        addObject.Email = project.studentId.email;
        addObject.ApprovedByTeacher = allPendingProjects[index].isApproved;
        addObject.ApprovedByAdmin = allPendingProjects[index].isApprovedByAdmin;
        return newData.push(addObject);
      });
    }

    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Project Status" + fileExtension);
  }
  //  Documents status
  function exportDocumentSheet() {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    // format data in right order.
    let newData = [];
    for (let index = 0; index < allPendingProjects.length; index++) {
      let addObject = {
        Year: allPendingProjects[index].studentYear,
        Division: allPendingProjects[index].div,
        Branch: allPendingProjects[index].branch,
      };

      allPendingProjects[index].marks.map((project) => {
        addObject.subject = allPendingProjects[index].subject;
        addObject.Title = allPendingProjects[index].title;
        addObject.Abstract = allPendingProjects[index].abstract;
        addObject.Name = project.studentId.name;
        addObject.GrNo = project.studentId.grNo;
        addObject.Email = project.studentId.email;
        addObject.Report = allPendingProjects[index].report
          ? "present"
          : "absent";
        addObject.ppt = allPendingProjects[index].ppt ? "present" : "absent";
        addObject.literatureReview = allPendingProjects[index].literatureReview
          ? "present"
          : "absent";
        return newData.push(addObject);
      });
    }
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Documents Status" + fileExtension);
  }
  // // // console.log("pending projects ");
  // // // console.log(allPendingProjects);
  const getAllPendingProjects = async () => {
    try {
      const headers = {
        authorization: "Bearer " + cookies.token,
        "Access-Control-Allow-Origin": "*",
      };
      // // // console.log("is approved ", isApproved);
      const response = await axios.get(
        `${url}/teacher/get-all-projects?teacherId=` +
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
      // // // console.log("response is ", response);
      if (response.data.status === "success") {
        setAllPendingProjects(response.data.result);
        setAlertMsg("Projects found");
        setAlertColor("green");
      } else {
        setAlertMsg(response.data.msg);
        setAlertColor("red");
        setAllPendingProjects(null);
      }
    } catch (error) {
      setAlertMsg("Server Error! Try again later");
      setAlertColor("red");
    }
  };

  // useEffect hook
  useEffect(() => {
    // // // console.log("use Effect.");
    getAllPendingProjects();
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
      minWidth: 600,
      height: 300,
      flex: 2,
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
      headerName: "Action",
      field: "isApproved",
      renderCell: ({ row }) => {
        return (
          <div>
            <ApproveProjectCell
              getAllPendingProjects={getAllPendingProjects}
              row={row}
              setAlertMsg={setAlertMsg}
              setAlertColor={setAlertColor}
            />
          </div>
        );
      },
    },
    {
      headerName: "Admin Status",
      field: "isApprovedByAdmin",
      renderCell: ({ row }) => {
        const color = row.isApprovedByAdmin ? "limegreen" : "yellow";
        const value = row.isApprovedByAdmin ? "Completed" : "Pending";
        return <Button style={{ backgroundColor: `${color}` }}>{value}</Button>;
      },
    },
    {
      field: "tasks.task",
      headerName: "VIEW",
      width: 300,

      renderCell: ({ row }) => {
        // // // console.log("row is ", row);
        // // // console.log("comments ", row.comments);
        return (
          <div>
            <button>
              <Link to="/teacher/show-single-project" state={{ project: row }}>
                View
              </Link>
            </button>
          </div>
        );
      },
    },
    {
      field: "comments",
      headerName: "Remark",
      // editable: true,
      width: 300,
      // renderCell: ({row}) => {
      //   return (
      //     <div>
      //       {
      //         row.comments ? <div> {row.comments} </div> : <div>NA</div>
      //       }
      //     </div>
      //   )
      // },

      // renderEditCell: ({ row }) => {
      //   // // // console.log("row is ", row);
      //   // // // console.log("comments ", row.comments);
      //   return (
      //     <div>
      //       <ProjectRemarkCell
      //         row={row}
      //         addRemark={addRemark}
      //         remark={remark}
      //         setRemark={setRemark}
      //         setProjectId={setProjectId}
      //       />
      //     </div>
      //   );
      // },
    },
    {
      field: "marks",
      headerName: "See/Add Marks",
      width: "200",
      renderCell: ({ row }) => {
        return (
          <Button>
            <Link to={"/teacher/add-midsem-marks"} state={{ project: row }}>
              ADD
            </Link>{" "}
          </Button>
        );
      },
    },
  ];

  return (
    <div data-testid='teacher-home'>
      {alertMsg ? (
        <ClosingAlert msg={alertMsg} alertColor={alertColor} />
      ) : (
        <span></span>
      )}

      <div>
        {allPendingProjects && allPendingProjects.length !== 0 ? (
          <div className="flex">
            <div>
              <button
                onClick={midSemMarks}
                className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg
                  className="fill-current w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Mid Sem Marks</span>
              </button>
            </div>
            <div>
              <button
                onClick={exportSheet}
                className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg
                  className="fill-current w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>End Sem Marks</span>
              </button>
            </div>
            <div>
              <button
                onClick={exportProjectSheet}
                className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg
                  className="fill-current w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Project Status</span>
              </button>
            </div>
            <div>
              <button
                onClick={exportDocumentSheet}
                className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg
                  className="fill-current w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Document Status</span>
              </button>
            </div>
          </div>
        ) : (
          <span></span>
        )}
      </div>
      <div>
        <SelectQuery
          setAlertMsg={setAlertMsg}
          getAllApprovedProjects={getAllPendingProjects}
        />
      </div>

      {/* {allPendingProjects && allPendingProjects.length !== 0 ? (
        allPendingProjects.map((project) => {
          return (
            <div key={project._id}>
              <ShowAllPendingProjects
                project={project}
                setAlertMsg={setAlertMsg}
              />
            </div>
          );
        })
      ) : (
        <div>No pending projects found</div>
      )} */}
      {allPendingProjects && allPendingProjects.length !== 0 ? (
        <div>
          <DataGrid
            rows={allPendingProjects}
            columns={columns}
            autoHeight
            rowHeight={400}
            getRowId={(data) => data._id}
            checkboxSelection
            onSelectionModelChange={(newSelectionModel) => {
              // // // console.log("selection", newSelectionModel);
              setSelectedProjectId(
                newSelectionModel[newSelectionModel.length - 1]
              );
            }}
          ></DataGrid>
          <div className="bg-slate-200 flex justify-center py-6">
            <form className="bg-white rounded-xl" onSubmit={addRemark}>
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

          {/* <div className="bg-red-400">
            <button onClick={exportSheet}>Download Marks</button>
          </div>
          <div className="bg-red-400">
            <button onClick={exportProjectSheet}>
              Download Project Status
            </button>
          </div> */}
        </div>
      ) : (
        <div>No pending projects found</div>
      )}
    </div>
  );
}
