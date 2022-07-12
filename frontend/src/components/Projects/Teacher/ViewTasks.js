import axios from "axios";
import React, { useState } from "react";

export default function ViewTasks({
  task,
  headers,
  setAlertMsg,
  getAllApprovedProjects,
  project,
}) {

  const [taskRemark, setTaskRemark] = useState(task.remark ? task.remark : '');
  
  return (
    <table>
      <tbody>
        <td>{task.task}</td>
        <td>
          <form onSubmit={ async (e) => {
            e.preventDefault()
            try{
              const response = await axios.patch('http://localhost:5000/projects/add-task-remark', {remark : taskRemark, taskId : task._id, projectId : project._id}, {headers})
              if(response.data.status !== "success") {
                setAlertMsg(response.data.msg)
              } else {
                getAllApprovedProjects()
              }
            } catch (error) {
              setAlertMsg("Server Error Not Responding. Try again later.")
            }
          }} >
            <div><textarea value={taskRemark} placeholder={'Add Remark'} onChange={(e) => {
              setTaskRemark(e.target.value)
            }}  cols="30" rows="10"></textarea></div>
            <div><input type="submit" value={'Add'} /></div>
          </form>
        </td>
        <td>
          {task.isCompleted ? (
            <span>Completed</span>
          ) : (
            <span>
              {" "}
              <button
                onClick={async () => {
                  try {
                    const response = await axios.patch(
                      "http://localhost:5000/projects/update-task-status",
                      {
                        taskId: task._id,
                        projectId: project._id,
                        isCompleted: true,
                      },
                      { headers }
                    );
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
                InComplete
              </button>{" "}
            </span>
          )}
        </td>
      </tbody>
    </table>
  );
}
