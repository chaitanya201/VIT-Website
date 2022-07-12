import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ClosingAlert from "../Auth/Alert";
import { DataGrid } from "@material-ui/data-grid";
// import ShowProjects from "../Projects/Students/ShowProjects";
// import ViewTasksInTable from "../Projects/Students/ViewTasksInTable";
// import ShowStudents from "./ShowStudents";
// import TaskComponent from "./TaskComponent";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import view from "../../Images/view.png";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

export default function AddTasks() {
  const [alertMsg, setAlertMsg] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [approvedProjects, setApprovedProjects] = useState(null);
  const [cookies] = useCookies();
  // const [task, setTask] = useState("");
  // // // // // console.log("approved projects", approvedProjects);
  // const [clicked, setClicked] = useState(false);
  // const [editTask, setEditTask] = useState("");
  // const [editButton, setEditButton] = useState(false);
  // const [editTask, setEditTask] = useState("");
  const headers = {
    authorization: "Bearer " + cookies.token,"Access-Control-Allow-Origin": "*",
  };
  const getAllApprovedProjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/projects/get-students-approved-projects?studentId=${user ? user._id : "123"}`,
        { headers }
      );
      // // // // // console.log("approved ", response.data);
      if (response.data.status === "failed") {
        setAlertMsg(response.data.msg);
      } else {
        setApprovedProjects(response.data.projects);
      }
    } catch (error) {
      setAlertMsg("Server Error. Unable to get projects");
    }
  };

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
        // // // // // console.log("params are ", params);
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
      field: "action",
      headerName: "View",
      renderCell: (params) => {
        // // // // // console.log("cell clicked");
        // // // // // console.log("project si", params.row);
        return (
          <div>
            <button>
              <Link
                to={"/student/show-single-project"}
                // when setAlertMsg is added to state it is refreshing the page. Find why?
                // state={{ project: params.row, setAlertMsg: setAlertMsg }}
                state={{ project: params.row }}
              >
                View
              </Link>
            </button>
          </div>
        );
      },
    },
    {
      field: "comments",
      headerName: "Teachers Remark",
      minWidth: 600,
      height: 300,
      flex: 2,
    },
    {
      field: "adminRemark",
      headerName: "Admin Remark",
      minWidth: 600,
      height: 300,
      flex: 2,
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
                  alt="Loading"
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
        // // // // // console.log("review ", params.row.literatureReview);
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
  // {
  //   field: "tasks",
  //   headerName: "Tasks",
  //   width: 300,

  //   renderCell: (params) => {
  //     return (
  //       <div>
  //         <div className="w-full space-y-2">
  //           {
  //             params.row.tasks.map((task) => {
  //               return (
  //                 <div >
  //                   <Typography>
  //                     {task.task}
  //                   </Typography>
  //                 </div>
  //               )
  //             })
  //           }
  //         </div>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   field: "tasks.task",
  //   headerName: "Action",
  //   width: 300,
  //   renderCell: (params) => {
  //     return (
  //       <div className="overflow-x-scroll">
  //         {params.row.tasks.map((task) => {
  //           return (
  //             <div id={task._id}>
  //               {!task.isCompleted ? (
  //                 !clicked ? (
  //                   <button
  //                     onClick={() => {
  //                       setClicked((preState) => !preState);
  //                       setEditTask(task.task);
  //                       // // // // // console.log("edit task", editTask);
  //                     }}
  //                   >
  //                     Edit
  //                   </button>
  //                 ) : (
  //                   <td>
  //                     <form
  //                       onSubmit={async (e) => {
  //                         e.preventDefault();
  //                         setClicked((preState) => !preState);
  //                         if (editTask.length < 3) return;
  //                         try {
  //                           const response = await axios.patch(
  //                             "http://localhost:5000/projects/update-task",
  //                             {
  //                               task: editTask,
  //                               taskId: task._id,
  //                               projectId: params.row._id,
  //                               isCompleted: task.isCompleted,
  //                             },
  //                             { headers }
  //                           );
  //                           // // // // // console.log("edit task response", response.data);
  //                           if (response.data.status !== "success") {
  //                             setAlertMsg(response.data.msg);
  //                           } else {
  //                             getAllApprovedProjects();
  //                           }
  //                         } catch (error) {
  //                           setAlertMsg("Server Error. Try again later");
  //                         }
  //                       }}
  //                     >
  //                       <div>
  //                         <textarea
  //                           cols="30"
  //                           rows="10"
  //                           value={editTask}
  //                           onChange={(e) => {
  //                             setEditTask(e.target.value);
  //                           }}
  //                         ></textarea>
  //                       </div>
  //                       <div>
  //                         <input type="submit" value={"Save Changes"} />
  //                       </div>
  //                       <div>
  //                         <button
  //                           onClick={() => {
  //                             setEditTask("");
  //                             setClicked((preState) => !preState);
  //                           }}
  //                         >
  //                           Cancel
  //                         </button>
  //                       </div>
  //                     </form>
  //                   </td>
  //                 )
  //               ) : (
  //                 <td>NA</td>
  //               )}
  //             </div>
  //           );
  //         })}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   field: "tasks.isCompleted",
  //   headerName: "Status",
  //   width: 200,
  //   renderCell: (params) => {
  //     return (
  //       <>
  //         {params.row.tasks.map((task) => {
  //           return <div id={task._id}>{task.isCompleted}</div>;
  //         })}
  //       </>
  //     );
  //   },
  // },
  // {
  //   field: "tasks.remark",
  //   headerName: "Remark",
  //   width: 100,
  //   renderCell: (params) => {
  //     return (
  //       <>
  //         {params.row.tasks.map((task) => {
  //           return <div id={task._id}>{task.remark}</div>;
  //         })}
  //       </>
  //     );
  //   },
  // },
  // ];

  // // // // // // console.log("task is ", task);
  return (
    <div>
      {alertMsg ? <ClosingAlert msg={alertMsg} /> : <div></div>}

      {/* Show approved Projects */}
      {approvedProjects && approvedProjects.length !== 0 ? (
        <div>
          {/* <div className="flex p-1 justify-between">
            <div>Title</div>
            <div>Abstract</div>

            <div>Subject</div>
            <div>Semester</div>
            <div>Name</div>
            <div>Email</div>
            <div>Task</div>
            <div>Action</div>
            <div>Status</div>
            <div>Remark</div>
          </div>

            <div className="justify-between p-1">
              {approvedProjects.map((project) => {
                return (
                  <div key={project._id} className="bg-green-400">
                    <ShowProjects project={project} check={true} />

                    <div>
                      {project.tasks && project.tasks.length !== 0 ? (
                        project.tasks.map((preTask, index) => {
                          return (
                            <ViewTasksInTable
                              project={project}
                              getAllApprovedProjects={getAllApprovedProjects}
                              setAlertMsg={setAlertMsg}
                              headers={headers}
                              task={preTask}
                              key={preTask._id}
                            />
                          );
                        })
                      ) : (
                        <div>No tasks found</div>
                      )}
                    </div>
                    <TaskComponent getAllApprovedProjects={getAllApprovedProjects} headers={headers} project={project} setAlertMsg={setAlertMsg} setClicked={setClicked} setTask={setTask} task={task} />
                    <div>
                      
                      {clicked ? (
                        <div></div>
                      ) : (
                        <div></div>
                      )} 
                    </div>
                  </div>
                );
              })}
            </div> */}
          <div>
            <DataGrid
              columns={columns}
              rows={approvedProjects}
              autoHeight
              rowHeight={300}
              rowCount={8}
              getRowId={(data) => data._id}
            ></DataGrid>
          </div>
        </div>
      ) : (
        <div>No Projects Found  Create new project or select proper fields.</div>
      )}
    </div>
  );
}
