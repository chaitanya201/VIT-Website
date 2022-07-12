import React from 'react'
import view from "../../../Images/view.png";
import { saveAs } from "file-saver";
export default function ShowUploadedDocuments({project}) {
  return (
    <>
      <td>{project.title}</td>
      <td>{project.abstract}</td>
      <td>{project.subject}</td>
      <td>{project.sem}</td>
      <td>
        {project.students.map((student) => {
          return (
            <tr>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.rollNo}</td>
            </tr>
          );
        })}
      </td>

      <td>
        <div>
          <div>
            {project.ppt ? (
              <img
                src={view}
                alt="View"
                onClick={() => {
                  saveAs(
                    "http://localhost:5000/view-ppt/" + project.ppt,
                    project.ppt
                  );
                }}
              />
            ) : (
              <span></span>
            )}
          </div>
          
        </div>
      </td>
      <td>
        <div>
          
          {project.report ? (
            <img
              src={view}
              alt="View"
              onClick={() => {
                saveAs(
                  "http://localhost:5000/view-report/" + project.report,
                  project.report
                );
              }}
            />
          ) : (
            <span></span>
          )}
        </div>
        
      </td>
      <td>
        <div>
          {project.literatureReview ? (
            <img
              src={view}
              alt="View"
              onClick={() => {
                saveAs(
                  "http://localhost:5000/view-litReview/" +
                    project.literatureReview,
                  project.literatureReview
                );
              }}
            />
          ) : (
            <span></span>
          )}
        </div>
        
      </td>
    </>
  )
}
