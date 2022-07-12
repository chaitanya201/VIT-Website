import { Button } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";

export default function ApproveProjectCell({
  row,
  setAlertMsg,
  getAllPendingProjects,
  setAlertColor,
}) {
  const [cookies] = useCookies();
  const url = 'http://localhost:5000'
  const approveProject = async (e) => {
    try {
      const response = await axios.patch(
        `${url}/projects/approve-project`,
        { projectId: row._id },
        {
          headers: {
            authorization: "Bearer " + cookies.token,"Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log("res data ", response.data)
      if (response.data.status === "success") {
        setAlertColor("green");
        getAllPendingProjects();
        return;
      }
      setAlertColor("red");
      setAlertMsg(response.data.msg);
    } catch (error) {
        console.log("error is ")
        console.log(error)
      setAlertMsg("Server Error. Try again later");
      setAlertColor('red')
    }
  };
  return (
    <div>
      <div key={row._id}>
            {row.isApproved ? (
              <Button style={{ backgroundColor: "limegreen" }}>Approved</Button>
            ) : (
              <Button onClick={approveProject} style={{ backgroundColor: "yellow" }}>Pending</Button>
            )}
          </div>
    </div>
  );
}
