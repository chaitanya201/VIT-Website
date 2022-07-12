import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { changeSem,changeDiv,changeProjectYear,changeStudentBranch,changeStudentYear,changeSubject, changeIsApproved,changeIsApprovedByAdmin } from "../../store/reducers/adminSelectQuery";

export default function AdminQuerySelector({
  
  getTeachersProjects,
  
}) {
  const semester = [
    { label: "Semester 1", value: 1 },
    { label: "Semester 2", value: 2 },
  ];

  const stdYear = [
    { label: "First Year", value: "firstYear" },
    { label: "Second Year", value: "secondYear" },
    { label: "Third Year", value: "thirdYear" },
    { label: "Final Year", value: "finalYear" },
  ];

  const branch = [
    {
      label: "Electronics And Telecommunications",
      value: "electronicsAndTelecommunications",
    },
    { label: "Computer Science", value: "computerScience" },
    { label: "Chemical Engineering", value: "chemicalEngineering" },
    { label: "Mechanical Engineering", value: "mechanicalEngineering" },
    { label: "Instrumentation", value: "instrumentation" },
    { label: "Artificial Intelligence", value: "artificialIntelligence" },
  ];


  const subjects = [
    { value: "operatingSystem", label: "Operating System" },
    { value: "dataScience", label: "Data Science" },
    { value: "signalProcessing", label: "Signal Processing" },
    { value: "sdp", label: "SDP" },
    { value: "computerVision", label: "Computer Vision" },
  ];
  const years = [
    {
      label: 2022,
      value: 2022,
    },
    {
      label: 2023,
      value: 2023,
    },
    {
      label: 2024,
      value: 2024,
    },
    {
      label: 2025,
      value: 2025,
    },
    {
      label: 2026,
      value: 2026,
    },
    {
      label: 2027,
      value: 2027,
    },
    {
      label: 2028,
      value: 2028,
    },
    {
      label: 2029,
      value: 2029,
    },
    {
      label: 2030,
      value: 2030,
    },
  ];
  const division = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "E", value: "E" },
  ];

  // const yr = ["FY", "SY", "TY", "FINAL"];
  // const branch = ["ET", "CS", "IT", "MECH", "INST", "CH"];
  // const divs = ["A", "B", "C", "D", "E"];

  // for (const y in yr) {
  //   for (const b in branch) {
  //     for (const d in divs) {
  //       division.push({
  //         label: yr[y] + branch[b] + divs[d],
  //         value: yr[y] + " " + branch[b] + " " + divs[d],
  //       });
  //     }
  //   }
  // }

  const approved = [
    { label: "Approved By Teacher", value: true },
    { label: "Not Approved By Teacher", value: false },
  ];
  const adminApproved = [
    { label: "Approved By Admin", value: true },
    { label: "Not Approved By Admin", value: false },
  ];

  // Getting all the required states from the store.

  const year = useSelector((state) => state.adminSelectQuery.adminSelectQuery.projectYear)
  const div = useSelector((state) => state.adminSelectQuery.adminSelectQuery.div)
  const studentYear = useSelector((state) => state.adminSelectQuery.adminSelectQuery.studentYear)
  const studentBranch = useSelector((state) => state.adminSelectQuery.adminSelectQuery.studentBranch)
  const sem = useSelector((state) => state.adminSelectQuery.adminSelectQuery.sem)
  const subject = useSelector((state) => state.adminSelectQuery.adminSelectQuery.subject)
  const isApproved = useSelector((state) => state.adminSelectQuery.adminSelectQuery.isApproved)
  const isApprovedByAdmin = useSelector((state) => state.adminSelectQuery.adminSelectQuery.isApprovedByAdmin)


    // creating dispatch instance to call the corresponding dispatch methods
    const dispatch = useDispatch()



  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("request sent");
          getTeachersProjects();
        }}
      >
         <div>
          <div>
            <Select
              options={semester}
              value={sem}
              onChange={(e) => {
                dispatch( changeSem({ label: e.label, value: e.value }));
              }}
            ></Select>
          </div>
          <div>
            <Select
              value={subject}
              options={subjects}
              onChange={(e) => {
                dispatch(changeSubject({ label: e.label, value: e.value }));
              }}
            ></Select>
          </div>
          <div>
            <Select
              options={years}
              value={year}
              onChange={(e) => {
                dispatch(changeProjectYear({ label: e.label, value: e.value }));
              }}
            ></Select>
          </div>

          <div>
            <Select
              options={branch}
              value={studentBranch}
              onChange={(e) => {
                dispatch(changeStudentBranch({ label: e.label, value: e.value }));
              }}
            ></Select>
          </div>
          <div>
            <Select
              options={stdYear}
              value={studentYear}
              onChange={(e) => {
                dispatch(changeStudentYear({ label: e.label, value: e.value }));
              }}
            ></Select>
          </div>
          <div>
            <Select
              options={division}
              value={div}
              onChange={(e) => {
                dispatch(changeDiv({ label: e.label, value: e.value }));
              }}
            ></Select>
          </div>
          <div>
            <Select
              options={approved}
              value={isApproved}
              onChange={(e) => {
                dispatch(changeIsApproved({ label: e.label, value: e.value }));
              }}
            ></Select>
          </div>
          <div>
            <Select
              options={adminApproved}
              value={isApprovedByAdmin}
              onChange={(e) => {
                dispatch(changeIsApprovedByAdmin({ label: e.label, value: e.value }));
              }}
            ></Select>
          </div>
          <div className="flex  p-2 justify-center">
            <input className="bg-sky-500 text-white p-2 rounded-md  " type="submit" value={"Show Result"} />
          </div>
        </div>
      </form>
    </div>
  );
}
