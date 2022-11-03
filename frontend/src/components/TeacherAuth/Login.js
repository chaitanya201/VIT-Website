import React, { useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import Alert from "../Auth/Alert";
import { useDispatch } from "react-redux";
import { changeUser } from "../../store/reducers/user";
import Spinner from "../helper/Spinner";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const alterMsgColor = "red";
  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onFormSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 8) {
      setAlertMsg("Password should be at least 8 characters");
      return;
    }
    setIsLoading(true);
    const user = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/teacher/login",
        user,
        {
          withCredentials: true,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
      setIsLoading(false);

      // console.log("res =", response.data);
      if (response.data.status === "success") {
        // console.log("data after login is ", response.data);
        // console.log("logged in.........")
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
      console.log(error);
      setIsLoading(false)
      setAlertMsg("Server Error. Try again later.");
    }
  };

  return (
    <div>
      {alertMsg ? (
        <div data-testid="alert">
          <Alert msg={alertMsg} alertColor={alterMsgColor} />
        </div>
      ) : (
        <div data-testid="non"> </div>
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
              data-testid="teacher-email"
              required={true}
            />
            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={onPasswordChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              data-testid="teacher-password"
              required={true}
            />
            <div className="flex justify-center items-center mt-6">
              <button
                className="w-full px-6 py-2 mb-2 text-white bg-emerald-600 rounded-lg hover:bg-blue-900"
                // className="bg-red-600"
                data-testid="teacher-login-btn"
              >
                {isLoading ? (
                  <span data-testid="spinner">
                    <Spinner />
                  </span>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>
            <div>
              <Link to={"/teacher/forget-password"} data-testid='forget-password'>forget password</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
