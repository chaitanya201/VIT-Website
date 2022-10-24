import React, { useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import ClosingAlert from "../../Auth/Alert";
import { useDispatch } from "react-redux";
import { changeUser } from "../../../store/reducers/user";
export default function Login() {
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
    const user = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/login",
        user,
        { withCredentials: true, headers: { "Access-Control-Allow-Origin": "*" } }
      );
      console.log("res", response);
      if (response.data.status === "success") {
        // console.log("data after login is ", response.data);
        // removeCookie('student')
        // removeCookie('teacher')
        // removeCookie('teacherToken')
        // removeCookie('token')
        // const expires = new Date(Date.now() + (60*24*3600000))
        // setCookies('teacher', response.data.teacher , {path:'/', expires, maxAge: 2 * 60 * 60 * 1000})
        // setCookies('teacherToken', response.data.token , {path:'/',expires, maxAge: 2 * 60 * 60 * 1000})
        dispatch(
          changeUser({
            name: response.data.admin.name,
            pic: response.data.admin.pic,
            position: response.data.admin.position,
            email: response.data.admin.email,
            _id: response.data.admin._id,
          })
        );
        navigate("/admin/home");
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
        <ClosingAlert msg={alertMsg} alertColor={alterMsgColor} />
      ) : (
        <div> </div>
      )}
      <div className="h-screen flex bg-gray-100" data-testid="admin-login">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            Admin Login 🔐
          </h1>
          <form method="post" onSubmit={onFormSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={onEmailChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={onPasswordChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <div className="flex justify-center items-center mt-6">
              <input
                type="submit"
                value="Login"
                className="w-full px-6 py-2 mt-4 text-white bg-emerald-600 rounded-lg hover:bg-blue-900"
              />
            </div>
          </form>
          <div>
            <div>
              <Link to={"/admin/forget-password"}>forget password</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
