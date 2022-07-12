import { Button } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

export default function TaskApproveCell({
  task,
  project,
  setAlertMsg,
  setNewProject,
  setAlertColor,
}) {
  const [cookies] = useCookies();
  const user = useSelector((state) => state.user.user);
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };
  const url = 'http://localhost:5000'

  const color = task.isCompleted ? "limegreen" : "yellow";
  const value = task.isCompleted ? "Completed" : "Pending";
  return (
    <div>
      <Button
        style={{ backgroundColor: `${color}` }}
        onClick={async () => {
          try {
            const response = await axios.patch(
              `${url}/projects/update-task-status?teacherId=${
                user ? user._id : "12"
              }`,
              {
                taskId: task._id,
                projectId: project._id,
                isCompleted: true,
              },
              { headers }
            );
            console.log("res===", response.data);
            if (response.data.status !== "success") {
              setAlertMsg(response.data.msg);
              setAlertColor("red");
            } else {
              setNewProject(response.data.project);
              setAlertColor("green");
              setAlertMsg("Task Added..");
            }
          } catch (error) {
            setAlertMsg("Server Error. Try again later");
          }
        }}
      >
        {value}{" "}
      </Button>
    </div>
  );
}
