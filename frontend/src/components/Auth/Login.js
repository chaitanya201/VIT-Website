import React, { useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import Alert from "./Alert";
import { useDispatch } from "react-redux";
import { changeUser } from "../../store/reducers/user";
export default function Login() {
  
  const isEmail = (emailAddress) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (emailAddress.match(regex)) return true;
    else return false;
  };

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const alterMsgColor = "red";
  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const dispatch = useDispatch();
  const onFormSubmit = async (event) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setAlertMsg("Invalid Email");
      return;
    }
    const user = {
      email: email,
      password: password,
    };
    const response = await axios.post(
      "http://localhost:5000/student/login",
      user,
      { withCredentials: true, headers: { "Access-Control-Allow-Origin": "*" } }
    );

    if (response.data.status === "success") {
      console.log("data after login is ", response.data.student);
      // removeCookie('teacher')
      // removeCookie('teacherToken')
      // removeCookie('admin')
      // removeCookie('adminToken')
      // localStorage.setItem('studentname',JSON.stringify(response.data.student))
      // const expires = new Date(Date.now() + (60*24*3600000))
      // setCookies('student', response.data.student , {path:'/', expires, maxAge: 2 * 60 * 60 * 1000})
      // setCookies('token', response.data.token , {path:'/',expires, maxAge: 2 * 60 * 60 * 1000})
      dispatch(
        changeUser({
          name: response.data.student.name,
          pic: response.data.student.pic,
          position: response.data.student.position,
          email: response.data.student.email,
          _id: response.data.student._id,
        })
      );
      navigate("/student/home");
    } else {
      console.log("failed to login");
      setAlertMsg("Email or Password is incorrect");
    }
  };

  return (
    <div>
      {alertMsg ? (
        <Alert msg={alertMsg} alertColor={alterMsgColor} />
      ) : (
        <div> </div>
      )}
      <div className="h-screen flex bg-gray-100" data-testid="student-login">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            Login 🔐
          </h1>
          <form method="post" onSubmit={onFormSubmit}>
            <input
              data-test-id="email"
              type="email"
              name="email"
              placeholder="Email"
              onChange={onEmailChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <br />
            <input
              data-test-id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={onPasswordChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <div className="flex justify-center items-center mt-6">
              <input
                data-test-id="submit"
                type="submit"
                value="Login"
                className="w-full px-6 py-2 mt-4 text-white bg-emerald-600 rounded-lg hover:bg-blue-900"
              />
            </div>
          </form>
          <div>
            <Link to={"/student/forget-password"}>forget password</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
