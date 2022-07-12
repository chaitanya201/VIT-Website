import axios from 'axios';
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import ClosingAlert from '../../Auth/Alert';

export default function AdminChangePassword()  {
    const [originalPassword, setOriginalPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [alertMsg, setAlertMsg] = useState(null);
    const [alertMsgColor, setAlertMsgColor] = useState("red");
    const [cookies] = useCookies();
    
    
    const headers = { authorization: "Bearer " + cookies.token ,"Access-Control-Allow-Origin": "*",};
    const formSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.patch(
          "http://localhost:5000/admin/change-password",
          {originalPassword,newPassword},
          { headers, withCredentials: true }
        );
        if (response.data.status === "success") {
          setAlertMsg("Password Changed");
          setAlertMsgColor("green");
          return;
        }
        setAlertMsg("Unable to change the password");
        setAlertMsgColor("red");
      } catch (error) {
        setAlertMsg("Failed to change the password");
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
        <div className='p-4'>
          <form onSubmit={formSubmit}>
            <div className='p-2'>
              <label>Original Password</label>
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
                value={originalPassword}
                onChange={(e) => setOriginalPassword(e.target.value)}
              />
            </div>
            <div className='p-2'>
              <label>New Password</label>
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className='flex justify-center'>
              <input className="bg-green-400 p-2 rounded-lg " type="submit" value={'Change'} />
            </div>
          </form>
        </div>
      </div>
    );
  }
  
