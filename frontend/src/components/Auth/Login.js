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
    try {
      const response = await axios.post(
        "http://localhost:5000/student/login",
        user,
        { withCredentials: true, headers: { "Access-Control-Allow-Origin": "*" } }
      );
  
      if (response.data.status === "success") {
        console.log("data after login is ", response.data.student);
        
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
    } catch (error) {
      console.log(error);
      setAlertMsg("Server Error. Try again later.")
    }
  };

  return (
    <div>
      {alertMsg ? (
        <div data-testid="alert">
          <Alert  msg={alertMsg} alertColor={alterMsgColor} />
        </div>
      ) : (
        <div data-testid="non"> </div>
      )}
      <div className="h-screen flex bg-gray-100" data-testid="student-login">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            Login 🔐
          </h1>
          <form
            method="post"
            onSubmit={onFormSubmit}
            data-testid="student-login-form"
          >
            <input
              data-testid="student-email"
              type="email"
              name="email"
              placeholder="Email"
              onChange={onEmailChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <br />
            <input
              data-testid="student-password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={onPasswordChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <div className="flex justify-center items-center mt-6">
              <input
                data-testid="student-submit"
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
