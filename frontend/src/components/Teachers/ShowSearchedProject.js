import React from "react";
import { saveAs } from "file-saver";
import view from "../../Images/view.png";

import { useSelector } from "react-redux";

export default function ShowSearchedProject() {
  
  const project = useSelector((state) => state.searchedProject.project )
  var pptColor = project.ppt ? "green-400" : "white";
  var reportColor = project.report ? "green-400" : "white";
  var litReviewColor = project.literatureReview ? "green-400" : "white";
  if (!project) {
    return (
      <div className="bg-red-400">
        Visit this page through proper steps only
      </div>
    );
  }

  return (
    <div>
      
      <div className="bg-slate-200">
        <div className="text-center">
          <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
            <label className="uppercase font-bold text-lg">Title</label>
            <h1 className="text-3xl  font-serif">{project.title}</h1>
          </div>
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
                            saveAs(project.ppt, project.ppt);
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
                            saveAs(project.report, project.report);
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
            <h1 className="uppercase font-serif">Group Members And Marks </h1>
          </div>
          <div className="text-center">
            {project.marks.map((student) => {
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
        
      </div>
    </div>
  );
}
