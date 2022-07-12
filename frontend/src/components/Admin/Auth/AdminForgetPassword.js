import axios from "axios";
import React, { useState } from "react";
import ClosingAlert from "../../Auth/Alert";

export default function AdminForgetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertMsgColor, setAlertMsgColor] = useState("red");
  const [key, setKey] = useState("");
  const formSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlertMsg("Password and Confirm Password is not same");
      setAlertMsgColor("red");
      return;
    }
    try {
      const response = await axios.patch(
        "http://localhost:5000/admin/forget-password",
        { email, password, key },
        { withCredentials: true ,headers:{"Access-Control-Allow-Origin": "*",}}
      );
      if (response.data.status === "success") {
        setAlertMsgColor("green");
        setAlertMsg("Password Changed");
        return;
      } else {
        setAlertMsg(response.data.msg);
        setAlertMsgColor("red");
      }
    } catch (error) {
      setAlertMsg("Failed to update the password.");
      setAlertMsgColor("red");
    }
  };
  return (
    <div>
      <div>
        {alertMsg ? (
          <ClosingAlert
            msg={alertMsg}
            alertColor={alertMsgColor}
          ></ClosingAlert>
        ) : (
          <span></span>
        )}
      </div>
      <div className="text-center font-serif text-2xl p-2">Forget Password</div>
      <div className="p-2">
        <form onSubmit={formSubmit}>
          <div className="p-2">
            <input
              className="form-control block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>
          <div className="p-2">
            <input
              className="form-control block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              type="password"
              required
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
            />
          </div>
          <div className="p-2">
            <input
              className="form-control block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.trim())}
            />
          </div>
          <div className="p-2">
            <input
              className="form-control block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              type="text"
              required
              placeholder="Enter Secrete Key"
              value={key}
              onChange={(e) => setKey(e.target.value.trim())}
            />
          </div>
          <div className="flex justify-center">
            <input
              type="submit"
              value={"Change"}
              className="bg-green-400 rounded-lg p-2"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
