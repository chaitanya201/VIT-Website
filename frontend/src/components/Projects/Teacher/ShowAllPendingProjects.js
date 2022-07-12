import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

export default function ShowAllPendingProjects({ project, setAlertMsg }) {
  const [remark, setRemark] = useState(
    project.comments ? project.comments : ""
  );
  const [cookies] = useCookies();
  const [color, setColor] = useState("yellow");
  const approveProject = async (e) => {
    try {
      const response = await axios.patch(
        "http://localhost:5000/projects/approve-project",
        { projectId: project._id },
        {
          headers: {
            authorization: "Bearer " + cookies.token,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response.data.status === "success") {
        return setColor("green");
      }
      setAlertMsg(response.data.msg);
    } catch (error) {
      setAlertMsg("Server Error. Try again later");
    }
  };
  return (
    <div>
      <div className="flex space-x-5 m-auto px-2 py-2">
        <div>{project.title}</div>
        <div>{project.abstract}</div>
        <div className="bg-blue-400 ">
          {project.students.map((student) => {
            return (
              <div key={student._id} className="flex space-x-2">
                <div>{student.name}</div>
                <div>{student.email}</div>
                <div>{student.rollNo}</div>
              </div>
            );
          })}
        </div>
        <div>
          <form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              if (remark.trim().length === 0) return;
              try {
                console.log("request sent");
                const response = await axios.patch(
                  "https://student-project-management.herokuapp.com/projects/addRemark",
                  { remark: remark.trim(), projectId: project._id },
                  {
                    headers: {
                      authorization: "Bearer " + cookies.token,
                      "Access-Control-Allow-Origin": "*",
                    },
                  }
                );
                console.log("res", response);
                if (response.data.status !== "success") {
                  setAlertMsg(response.data.msg);
                }
              } catch (error) {
                console.log("error is ", error);
                setAlertMsg("Server Error! Try again later");
              }
            }}
          >
            <textarea
              cols="30"
              rows="10"
              value={remark}
              placeholder="Add remark"
              onChange={(e) => {
                setRemark(e.target.value);
              }}
            ></textarea>
            <div>
              <input type="submit" value={"Add"} />
            </div>
          </form>
        </div>
        <div>
          <button className={`bg-${color}-500 `} onClick={approveProject}>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
