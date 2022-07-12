import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

export default function EditCell({ row, project, setAlertMsg,setNewProject }) {
  const [cellValue, setCellValue] = useState(row.remark ? row.remark : "NA");
  const user = useSelector((state) => state.user.user)
  console.log("custom ", cellValue);
  const [cookie] = useCookies();
  const url = 'http://localhost:5000'

  const headers = {
    authorization: "Bearer " + cookie.token,
  };
  console.log("cell value is ", cellValue);
  // console.log("....", cookie);
  const formSubmit = async (e) => {
    e.preventDefault();
    console.log("in form");
    if (cellValue.length < 4) return;
    console.log("passed");
    try {
      const response = await axios.patch(
        `${url}/projects/add-task-remark?teacherId=${user ? user._id : "123"}` ,
        { remark: cellValue, projectId: project._id, taskId: row._id },
        { headers }
      );
      console.log("response is ", response.data);
      if (response.data.status !== "success") {
        console.log('server failed to add teh task.');
        setAlertMsg(response.data.msg);
      } else {
        console.log('task added....');
        setNewProject(response.data.project)
        setAlertMsg(null);
      }
    } catch (error) {
      console.log('error..');
      console.log(error);
      //   setAlertMsg("Server Error. try again later");
    }
  };

  return (
    <div>
      {
        <form
          onSubmit={formSubmit}
          className="flex bg-pink-200 w-full overflow-y-auto overflow-x-auto"
        >
          <textarea
            cols="30"
            rows="10"
            value={cellValue}
            onChange={(e) => {
              setCellValue(e.target.value);
            }}
          ></textarea>
          <button className="bg-red-700">
            <input type="submit" value={"Edit"} />
          </button>
        </form>
      }
    </div>
  );
}
