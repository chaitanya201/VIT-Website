import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ClosingAlert from "../Auth/Alert";
import ViewTasks from "../Projects/Teacher/ViewTasks";
import SelectQuery from "./SelectQuery";

export default function ShowApprovedProjects() {
  const [alertMsg, setAlertMsg] = useState(null);
  const [approvedProjects, setApprovedProjects] = useState(null);
  const [cookies] = useCookies();
  // states
  const [year, setYear] = useState({
    label: 2022,
    value: 2022,
  });
  const [div, setDiv] = useState({ label: "FYETA", value: "FY ET A" });
  const [sem, setSem] = useState({ label: "Semester 1", value: 1 });
  const [subject, setSubject] = useState({
    value: "operatingSystem",
    label: "Operating System",
  });
  const [isApproved, setIsApproved] = useState({
    label: "Approved",
    value: true,
  });

console.log("sem", sem);
console.log("div", div);

  const headers = {
    authorization: "Bearer " + cookies.teacherToken,
  };
  const getAllApprovedProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/teacher/get-all-projects?teacherId=" +
          cookies.teacher._id +
          "&div=" +
          div.value +
          "&status=" +
          isApproved.value +
          "&subject=" +
          subject.value +
          "&year=" +
          year.value +
          "&sem=" +
          sem.value,
        { headers }
      );
      console.log("data ", response.data);
      if (response.data.status === "failed") {
        setAlertMsg(response.data.msg);
      } else {
        setApprovedProjects(response.data.result);
      }
    } catch (error) {
      setAlertMsg("Server Error. Unable to get projects");
    }
  };

  return (
    <div>
      {alertMsg ? (
        <ClosingAlert msg={alertMsg} alertColor={"red"} />
      ) : (
        <div></div>
      )}
      <SelectQuery
        setAlertMsg={setAlertMsg}
        getAllApprovedProjects={getAllApprovedProjects}
        div={div}
        isApproved={isApproved}
        sem={sem}
        setDiv={setDiv}
        setIsApproved={setIsApproved}
        setSem={setSem}
        setSubject={setSubject}
        setYear={setYear}
        subject={subject}
        year={year}
      />
      {/* Show approved Projects */}
      {approvedProjects && approvedProjects.length !== 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <td>Title</td>
                <td>Abstract</td>

                <td>Subject</td>
                <td>Semester</td>
                <td>
                  <td>Group Mates</td>
                  <tr>
                    <td>Name</td>
                    <td>Email</td>
                  </tr>
                </td>
                <td>
                  <td>All Tasks</td>
                  <tr>
                    <td>Tasks</td>
                    <td>Remarks</td>
                    <td>Status</td>
                  </tr>
                </td>
              </tr>
            </thead>
            <tbody>
              {approvedProjects.map((project) => {
                return (
                  <tr key={project._id} className="bg-green-400">
                    <td>{project.title}</td>
                    <td>{project.abstract}</td>
                    <td>{project.subject}</td>
                    <td>{project.sem}</td>
                    <td>
                      {project.students.map((student) => {
                        return (
                          <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                          </tr>
                        );
                      })}
                    </td>
                    <td>
                      {/* show previous tasks */}
                      {project.tasks && project.tasks.length !== 0 ? (
                        project.tasks.map((preTask, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <ViewTasks
                                  project={project}
                                  getAllApprovedProjects={
                                    getAllApprovedProjects
                                  }
                                  setAlertMsg={setAlertMsg}
                                  headers={headers}
                                  task={preTask}
                                  key={preTask._id}
                                />
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <div>No tasks found</div>
                      )}
                    </td>

                    <div className="bg-pink-700">...</div>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Show group members */}
        </div>
      ) : (
        <div>No Projects Found</div>
      )}
    </div>
  );
}
