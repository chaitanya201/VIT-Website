import React, { useState } from "react";
import { useCookies } from "react-cookie";
import ClosingAlert from "./Alert";
import Select from "react-select";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebaseStorage/firebaseConfiguration";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// import { changed } from "../../store/reducers/stateChanged";
import { changeUser } from "../../store/reducers/user";

export default function EditProfile() {
  const user = useSelector((state) => state.user.user);
  const [cookies] = useCookies();
  const [name, setName] = useState(
    user && user.position === "student" ? user.name : ""
  );
  const [currentEmail, setCurrentEmail] = useState(
    user && user.position === "student" ? user.email : ""
  );
  const [newEmail, setNewEmail] = useState(
    user && user.position === "student" ? user.email : ""
  );
  const [branch, setBranch] = useState({
    label: "Electronics And Telecommunications",
    value: "electronicsAndTelecommunications",
  });
  const [div, setDiv] = useState({ label: "A", value: "A" });
  const [grNo, setGrNo] = useState(
    cookies.user && cookies.user.position === "student" && cookies.user.grNo
      ? cookies.user.grNo
      : ""
  );
  const [rollNo, setRollNo] = useState(
    cookies.user && cookies.user.position === "student"
      ? cookies.user.rollNo
      : ""
  );
  const [mobile, setMobile] = useState(
    cookies.user && cookies.user.position === "student"
      ? cookies.user.mobile
      : ""
  );
  const [pic, setPic] = useState("");
  const [year, setYear] = useState({ label: "Third Year", value: "thirdYear" });
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
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertMsgColor, setAlertMsgColor] = useState("red");
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };

  const dispatch = useDispatch();
  const formSubmit = async (e) => {
    e.preventDefault();
    const student = {
      name,
      currentEmail,
      mobile,
      branch: branch.value,
      year: year.value,
      div: div.value,
      grNo,
      rollNo,
      newEmail,
    };
    if (pic) {
      // uploading pic to firebase
      const picName = v4() + pic.name;
      const picReference = ref(storage, `ProfilePictures/Students/${picName}`);

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
        student.pic = url;
      } catch (error) {
        setAlertMsg("Failed to update the profile. Try again");
        setAlertMsgColor("red");
      }
    }
    try {
      const response = await axios.patch(
        "http://localhost:5000/student/edit-profile",
        student,
        { headers, withCredentials: true }
      );
      // // // // // console.log("updated user")
      // // // // // console.log(response.data.student);
      if (response.data.status === "success") {
        setAlertMsgColor("green");
        setAlertMsg("Profile Updated");
        dispatch(
          changeUser({
            name: response.data.student.name,
            pic: response.data.student.pic,
            position: response.data.student.position,
            email: response.data.student.email,
            _id: response.data.student._id,
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

      <div>
        <form onSubmit={formSubmit}>
          <div className="p-2">
            <div className="p-4">
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
            <div className="p-4">
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
            <div className="p-4">
              <label>Gr.No:</label>
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
                value={grNo}
                onChange={(e) => {
                  setGrNo(e.target.value);
                }}
              />
            </div>
            <div className="p-4">
              <label>Roll No:</label>
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
                value={rollNo}
                onChange={(e) => {
                  setRollNo(e.target.value);
                }}
              />
            </div>
            <div className="p-4">
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
            <div className="p-4">
              <Select
                options={branchOptions}
                value={branch}
                onChange={(e) => setBranch({ label: e.label, value: e.value })}
              ></Select>
            </div>
            <div className="p-4">
              <Select
                options={stdYear}
                value={year}
                onChange={(e) => setYear({ label: e.label, value: e.value })}
              ></Select>
            </div>
            <div className="p-4">
              <Select
                options={division}
                value={div}
                onChange={(e) => setDiv({ label: e.label, value: e.value })}
              ></Select>
            </div>
            <div className="p-4">
              <label>Profile Pic</label>
              <input type="file" onChange={(e) => setPic(e.target.files[0])} />
            </div>
          </div>
          <div className="p-4">
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
              className="bg-green-500 p-3 rounded-md font-bold text-white uppercase"
              type="submit"
              value={"Edit"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
