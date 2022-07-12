import React from "react";
import ShowStudents from "../../Students/ShowStudents";

export default function ShowProjects({ project, check }) {
  return (
    <div>
      <div className="flex space-x-5 m-auto px-2 py-2">
        <div>{project.title}</div>
        <div>{project.abstract}</div>
        <div>{project.subject}</div>
        <div>{project.sem}</div>
        {!check ? (
          <div>
            {project.comments ? <div>{project.comments}</div> : <div>NA</div>}
          </div>
        ) : (
          <span></span>
        )}

        {check ? (
          <div className="flex-col">
          {project.students.map((student) => {
            return <ShowStudents student={student} key={student._id} />;
          })}
          </div>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
}
