import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ClosingAlert from "../Auth/Alert";
import { storage } from "../../firebaseStorage/firebaseConfiguration";
import { v4 } from "uuid";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { changeUser } from "../../store/reducers/user";

export default function TeacherEditProfile() {
  const [cookies] = useCookies();
  const user = useSelector((state) => state.user.user);
  const [name, setName] = useState(user ? user.name : "");
  const [currentEmail, setCurrentEmail] = useState(user ? user.email : "");
  const [newEmail, setNewEmail] = useState(user ? user.email : "");
  const [mobile, setMobile] = useState(cookies.user ? cookies.user.mobile : "");
  const [pic, setPic] = useState("");
  const dispatch = useDispatch();
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertMsgColor, setAlertMsgColor] = useState("red");
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };

  if (!user) {
    return <div className="bg-red-500">Please Login Again To Continue</div>;
  }

  const formSubmit = async (e) => {
    e.preventDefault();
    const teacher = {
      name,
      currentEmail,
      mobile,

      newEmail,
    };
    if (pic) {
      // uploading pic to firebase
      const picName = v4() + pic.name;
      const picReference = ref(storage, `ProfilePictures/Teachers/${picName}`);

      try {
        const uploadPicture = await uploadBytes(picReference, pic);
        if (!uploadPicture) {
          setAlertMsg("Unable to upload the pic. Try again");
          setAlertMsgColor("red");
          return;
        }
        // // // // // console.log("uploaded pic", uploadPicture);
        const url = await getDownloadURL(picReference);
        if (!url) {
          // // // // // console.log("url not found");
          setAlertMsg("Unable to get the url. Try again");
          setAlertMsgColor("red");
          return;
        }
        // // // // // console.log("url is ", url);
        teacher.pic = url;
      } catch (error) {
        setAlertMsg("Failed to update the profile. Try again");
        setAlertMsgColor("red");
      }
    }
    try {
      const response = await axios.patch(
        `http://localhost:5000/teacher/edit-profile?teacherId=${
          user ? user._id : "123"
        }`,
        teacher,
        { headers, withCredentials: true }
      );
      if (response.data.status === "success") {
        setAlertMsgColor("green");
        setAlertMsg("Profile Updated");
        dispatch(
          changeUser({
            name: response.data.teacher.name,
            pic: response.data.teacher.pic,
            position: response.data.teacher.position,
          })
        );
        return;
      }
      setAlertMsg(response.data.msg);
      setAlertMsgColor("red");
    } catch (error) {
      setAlertMsg("Failed to update the profile. Try again");
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
      <div className="flex justify-center">
        {user && user.pic ? (
          <img src={user.pic} alt="Loading" />
        ) : (
          <span></span>
        )}
      </div>
      <div className="p-4">
        <form onSubmit={formSubmit}>
          <div>
            <div className="p-2">
              <label>Name:</label>
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
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="p-2">
              <label>Email:</label>
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
                value={currentEmail}
                onChange={(e) => {
                  setCurrentEmail(e.target.value);
                }}
              />
            </div>

            <div className="p-2">
              <label>Mobile No:</label>
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
                type="number"
                required
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                }}
              />
            </div>

            <div className="p-2">
              <label>Profile Pic</label>
              <input type="file" onChange={(e) => setPic(e.target.files[0])} />
            </div>
          </div>
          <div className="p-2">
            <label htmlFor="email">Change Email</label>
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
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <input
              className="bg-green-500 p-3 rounded-lg font-bold text-white uppercase"
              type="submit"
              value={"Edit"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
