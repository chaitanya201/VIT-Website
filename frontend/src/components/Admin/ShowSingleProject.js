import { DataGrid } from "@material-ui/data-grid";
import React from "react";
// import { useCookies } from "react-cookie";
import { useLocation } from "react-router";

import view from "../../Images/view.png";
import { saveAs } from "file-saver";
import { Button } from "@material-ui/core";


export default function ShowSingleProject() {
  const location = useLocation();
  
  try {
    var { project } = location.state;
    console.log("first project is ");
    console.log(project);
  } catch (error) {
    console.log("erorr is ");
    console.log(error);

   
  }
  

  if(!project) {
    return(
      <div className="bg-red-500">Visit this page through proper steps only</div>
    )
  }
  
  var pptColor = project.ppt ? "green-400" : "white";
  var reportColor = project.report ? "green-400" : "white";
  var litReviewColor = project.literatureReview ? "green-400" : "white";
  console.log(" new project is ", project);

 

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
          const color = params.row.isCompleted ? 'limegreen' : 'yellow'
          const value = params.row.isCompleted ? 'Completed' : "Pending"
        return (
            <Button style={{backgroundColor: `${color}`}}>{value}</Button>
         
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
      
      
    },
  ];
  return (
    <div>
      
      <div className="bg-slate-200">
        <div className="text-center">
          <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
            <label className="uppercase font-bold text-lg">Title</label>
            <h1 className="text-3xl  font-serif">{project.title}</h1>
            
          </div>
          <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
            <label className="uppercase font-bold text-xl">Abstract</label>
            <h1 className="text-xl  font-serif">{project.abstract}</h1>
           
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
                    {project.ppt ? (
                      <div>
                        <img
                          src={view}
                          alt="Loading"
                          onClick={() => {
                            saveAs(
                              "http://localhost:5000/view-ppt/" +
                                project.ppt,
                              project.ppt
                            );
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
                    {project.report ? (
                      <div>
                        <img
                          src={view}
                          alt="Loading"
                          onClick={() => {
                            saveAs(
                              "http://localhost:5000/view-report/" +
                                project.report,
                              project.report
                            );
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
                    {project.literatureReview ? (
                      <div>
                        <img
                          src={view}
                          alt="Loading"
                          onClick={() => {
                            saveAs(
                              "http://localhost:5000/view-litReview/" +
                                project.literatureReview,
                              project.literatureReview
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
              {project.students.map((student) => {
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
          rows={project.tasks}
          columns={columns}
          getRowId={(data) => data._id}
          autoHeight
          rowHeight={400}
        ></DataGrid>
      </div>
     
    </div>
  );

}
