import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Select from "react-select";

import Alert from "./Alert";

// Register component
export default function Register() {
  const navigate = useNavigate(); // creating navigate object

  // declaring variables to store user info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState(3);
  const [year, setYear] = useState({label : "First Year", value : "firstYear"});
  const [branch, setBranch] = useState({value : "electronicsAndTelecommunications", label: "Electronics and Telecommunications"});
  const [div, setDiv] = useState({label :"A", value : "A"});
  const [grNo, setGrNo] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const stdYear = [
    { label: "First Year", value: "firstYear" },
    { label: "Second Year", value: "secondYear" },
    { label: "Third Year", value: "thirdYear" },
    { label: "Final Year", value: "finalYear" },
  ];

  const branchOptions = [
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
  const division = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "E", value: "E" },
  ];
  // collecting user info
  const changeName = (event) => {
    setName(event.target.value);
  };
  const changeEmail = (event) => {
    setEmail(event.target.value);
  };
  const [rollNO, setRollNO] = useState("");
  const changeMobile = (event) => {
    setMobile(event.target.value);
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  // alert part
  const [alertMsg, setAlertMsg] = useState(null);
  const alterMsgColor = "red";
  console.log("branch is ")
  console.log(branch.value);
  // defining what would happen after form submission
  const onFormSubmit = async (event) => {
    event.preventDefault();
    setLoadingState(true)
    if (!name.trim()) {
      setAlertMsg("Provide Valid name");
      return;
    }
    if (password.length < 8) {
      setAlertMsg("Password length is less than 8");
      return;
    }
    const user = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      mobile: mobile,
      rollNo : rollNO,
      div: div.value,
      year: year.value,
      branch: branch.value,
      grNO: grNo
    };
    console.log("user is ", user);
    try {
      const response = await axios.post(
        "http://localhost:5000/student/register",
        user,{headers:{"Access-Control-Allow-Origin": "*"}}
      );
      console.log("after registrations in form function");
      if (response.data.status === "success") {
        console.log("registration is successful in same function");
        console.log("this is the user after login ");
        navigate("/login");
      } else {
        console.log("registration failed", response.data.msg);
        const msg = response.data.msg;
        setAlertMsg(msg);
        console.log("alert msg is ", alertMsg);
      }
    } catch (error) {
      setAlertMsg("Something went wrong. Try again later.")
    } finally{

      setLoadingState(false)
    }
  };
  return (
    <div>
    {
      loadingState ? <div>Sending Request....Please Wait.</div> : <span></span>
    }
      {alertMsg ? (
        <Alert msg={alertMsg} alertColor={alterMsgColor} />
      ) : (
        <div> </div>
      )}
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Register
        </h1>
        <form method="post" onSubmit={onFormSubmit}>
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            onChange={changeName}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            onChange={changeEmail}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <div>
            <Select value={branch} options={branchOptions} onChange={(e) => {setBranch({label: e.label, value:e.value})}}></Select>
          </div>
          <div>
            <Select value={year} options={stdYear} onChange={(e) => {setYear({label: e.label, value:e.value})}}></Select>
          </div>
          <input
            type="number"
            required
            value={grNo}
            placeholder="Gr. No"
            onChange={(e) => {
              setGrNo(e.target.value);
            }}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="number"
            required
            value={rollNO}
            placeholder="Roll No"
            onChange={(e) => {
              setRollNO(e.target.value);
            }}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <div>
            <Select options={division} value={div} onChange={(e) => {setDiv({label : e.label, value: e.value})}}></Select>
          </div>

          <input
            type="number"
            name="mobile"
            required
            placeholder="Mobile"
            onChange={changeMobile}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={changePassword}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="submit"
            value="Register"
            className="w-full px-6 py-2 mt-4 text-white bg-emerald-600 rounded-lg hover:bg-blue-900"
          />
        </form>
      </div>
    </div>
  );
}
