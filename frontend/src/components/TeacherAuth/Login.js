import React, { useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import Alert from "../Auth/Alert";
import { useDispatch } from "react-redux";
import { changeUser } from "../../store/reducers/user";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const alterMsgColor = "red";
  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onFormSubmit = async (event) => {
    event.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/teacher/login",
        user,
        { withCredentials: true, headers: { "Access-Control-Allow-Origin": "*" } }
      );
      console.log("res =", response.data);
      if (response.data.status === "success") {
        console.log("data after login is ", response.data);
        
        dispatch(
          changeUser({
            name: response.data.teacher.name,
            pic: response.data.teacher.pic,
            position: response.data.teacher.position,
            email: response.data.teacher.email,
            _id: response.data.teacher._id,
          })
        );
        navigate("/teacher/home");
      } else {
        console.log("failed to login");
        setAlertMsg("Email or Password is incorrect");
      }
    } catch (error) {
      console.log(error)
      setAlertMsg("Server Error. Try again later.")
    }
  };

  return (
    <div>
      {alertMsg ? (
        <Alert msg={alertMsg} alertColor={alterMsgColor} />
      ) : (
        <div> </div>
      )}
      <div className="h-screen flex bg-gray-100" data-testid="teacher-login">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            Teachers Login 🔐
          </h1>
          <form method="post" onSubmit={onFormSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={onEmailChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              data-testid = "teacher-email"
            />
            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={onPasswordChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              data-testid = "teacher-password"
            />
            <div className="flex justify-center items-center mt-6">
              <input
                type="submit"
                value="Login"
                className="w-full px-6 py-2 mt-4 text-white bg-emerald-600 rounded-lg hover:bg-blue-900"
                data-testid = "teacher-login-btn"
              />
            </div>
            <div>
              <Link to={"/teacher/forget-password"}>forget password</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
