import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ClosingAlert from "../../Auth/Alert";

// Register component
export default function Register() {
  const navigate = useNavigate(); // creating navigate object

  // declaring variables to store user info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState(3);
  const [secreteKey, setSecreteKey] = useState("");
  // collecting user info
  const changeName = (event) => {
    setName(event.target.value);
  };
  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changeMobile = (event) => {
    setMobile(event.target.value);
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  // alert part
  const [alertMsg, setAlertMsg] = useState(null);
  const alterMsgColor = "red";
  // defining what would happen after form submission
  const onFormSubmit = async (event) => {
    event.preventDefault();
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
      secreteKey,
    };
    console.log("user is ", user);
    const response = await axios.post(
      "http://localhost:5000/admin/register",
      user,
      { headers: { "Access-Control-Allow-Origin": "*" }, withCredentials: true }
    );
    console.log("after registrations in form function");
    if (response.data.status === "success") {
      console.log("registration is successful in same function");
      console.log("this is the user after login ");
      navigate("/admin-login");
    } else {
      console.log("registration failed", response.data.msg);
      const msg = response.data.msg;
      setAlertMsg(msg);
      console.log("alert msg is ", alertMsg);
    }
  };
  return (
    <div>
      {alertMsg ? (
        <ClosingAlert msg={alertMsg} alertColor={alterMsgColor} />
      ) : (
        <div> </div>
      )}
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16" data-testid="admin-register">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Teacher Registration
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

          <input
            type="password"
            value={secreteKey}
            required
            placeholder="Secrete Key"
            onChange={(e) => {
              setSecreteKey(e.target.value.trim());
            }}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />

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
