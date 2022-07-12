import axios from "axios";
import React, { useState } from "react";
import { saveAs } from "file-saver";
import view from "../../../Images/view.png";
export default function ShowUploadedDocuments({
  project,
  setAlertMsg,
  headers,
  getAllApprovedProjects,
}) {
  const [ppt, setPpt] = useState("");
  const [report, setReport] = useState("");
  const [literatureReview, setLiteratureReview] = useState("");

  // ppt
  const uploadPPT = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("ppt", ppt);
    data.append("projectId", project._id);
    try {
      const response = await axios.patch(
        "http://localhost:5000/projects/upload-ppt",
        data,
        { headers }
      );
      if (response.data.status !== "success") {
        setAlertMsg(response.data.msg);
      } else {
        getAllApprovedProjects();
      }
    } catch (error) {
      setAlertMsg("Server error. Try again later");
    }
  };

  // report
  const uploadReport = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("report", report);
    data.append("projectId", project._id);
    try {
      const response = await axios.patch(
        "http://localhost:5000/projects/upload-report",
        data,
        { headers }
      );
      if (response.data.status !== "success") {
        setAlertMsg(response.data.msg);
      } else {
        getAllApprovedProjects();
      }
    } catch (error) {
      setAlertMsg("Server error. Try again later");
    }
  };
  console.log("project is ", project);

  // literature review
  const uploadLiteratureReview = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("literatureReview", literatureReview);
    data.append("projectId", project._id);
    try {
      const response = await axios.patch(
        "http://localhost:5000/projects/upload-literature-review",
        data,
        { headers }
      );
      if (response.data.status !== "success") {
        setAlertMsg(response.data.msg);
      } else {
        getAllApprovedProjects();
      }
    } catch (error) {
      setAlertMsg("Server error. Try again later");
    }
  };
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
          <div>
            <form onSubmit={uploadPPT}>
              <div>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    setPpt(e.target.files[0]);
                  }}
                />
              </div>
              <div>
                <input type="submit" value={"upload PPT"} />
              </div>
            </form>
          </div>
        </div>
      </td>
      <td>
        <div>
          {/* {
          project.report ? <a href={`http://localhost:5000/view-report/${project.report}`} rel='noreferrer' target='_blank' download={`${project.report}`}>Download</a> : <span></span>
        } */}
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
              <input type="submit" value={"upload Review"} />
            </div>
          </form>
        </div>
      </td>
    </>
  );
}
