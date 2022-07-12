import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

export default function AddMarks({
  project,
  task,
  setAlertMsg,
  setAlertColor,
  setNewProject
}) {
  const [cookie] = useCookies();
  const [marks, setMarks] = useState("");
  const headers = {
    authorization: "Bearer " + cookie.teacherToken,"Access-Control-Allow-Origin": "*",
  };
  const url = 'http://localhost:5000'

  return (
    <div>
      <form 
      className="flex"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const response = await axios.patch(
              `${url}/projects/add-task-marks`,
              { marks: marks, projectId: project._id, taskId: task._id },
              { headers }
            );
            console.log('000' ,response.data)
            if (response.data.status !== "success") {
              setAlertMsg(response.data.msg);
              setAlertColor("red");
            } else {
              setAlertMsg("Marks added");
              setAlertColor("green");
              setNewProject(response.data.project)
            }
          } catch (error) {
            setAlertColor("red");
            setAlertMsg("Server Error. Try again later.");
          }
        }}
      >
        <div>
          <input
            type="number"
            value={marks}
            onChange={(e) => {
              setMarks(e.target.value);
            }}
          />
        </div>
        <div>
          <input type="submit" value={"Add marks"} className="bg-green-500 " />
        </div>
      </form>
    </div>
  );
}
