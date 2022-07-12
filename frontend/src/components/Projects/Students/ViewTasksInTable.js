import axios from "axios";
import React, { useState } from "react";
import TaskComponent from "../../Students/TaskComponent";

export default function ViewTasksInTable({
  task,
  headers,
  setAlertMsg,
  getAllApprovedProjects,
  project,
}) {
  const [clicked, setClicked] = useState(false);
  const [editTask, setEditTask] = useState("");
  return (
    <table>
      <tbody>
        <td>{task.task}</td>
        <td>
          {!task.isCompleted ? (
            !clicked ? (
              <button
                onClick={() => {
                  setClicked((preState) => !preState);
                  setEditTask(task.task);
                  console.log("edit task", editTask);
                }}
              >
                Edit
              </button>
            ) : (
              <td>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setClicked((preState) => !preState);
                    if (editTask.length < 3) return;
                    try {
                      const response = await axios.patch(
                        "http://localhost:5000/projects/update-task",
                        {
                          task: editTask,
                          taskId: task._id,
                          projectId: project._id,
                          isCompleted : task.isCompleted
                        },
                        { headers }
                      );
                      console.log("edit task response", response.data);
                      if (response.data.status !== "success") {
                        setAlertMsg(response.data.msg);
                      } else {
                        getAllApprovedProjects();
                      }
                    } catch (error) {
                      setAlertMsg("Server Error. Try again later");
                    }
                  }}
                >
                  <div>
                    <textarea
                      cols="30"
                      rows="10"
                      value={editTask}
                      onChange={(e) => {
                        setEditTask(e.target.value);
                      }}
                    ></textarea>
                  </div>
                  <div>
                    <input type="submit" value={"Save Changes"} />
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setEditTask("");
                        setClicked((preState) => !preState);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </td>
            )
          ) : (
            <td>NA</td>
          )}
        </td>
        <td>
          {task.isCompleted ? <span>Completed</span> : <span>Incomplete</span>}
        </td>
        <td>{
          task.remark ? task.remark : <span>NA</span>
        }</td>
      </tbody>
    </table>
  );
}
