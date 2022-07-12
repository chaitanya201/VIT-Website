import { Button } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";

export default function AdminApproveProjectCell({
  row,
  setAlertMsg,
  getTeachersProjects,
  setAlertMsgColor,
}) {
  const [cookies] = useCookies();

  const approveProject = async (e) => {
    try {
      const response = await axios.patch(
        "http://localhost:5000/admin/approve-project",
        { projectId: row._id },
        {
          headers: {
            authorization: "Bearer " + cookies.token,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response.data.status === "success") {
        setAlertMsgColor("green");
        getTeachersProjects();
        return;
      }
      setAlertMsgColor("red");
      setAlertMsg(response.data.msg);
    } catch (error) {
      console.log("error is ");
      console.log(error);
      setAlertMsg("Server Error. Try again later");
      setAlertMsgColor("red");
    }
  };
  return (
    <div>
      {row.isApprovedByAdmin ? (
        <div>
          <Button style={{ backgroundColor: "lawngreen" }}>Approved</Button>
        </div>
      ) : (
        <div>
          <Button
            style={{ backgroundColor: "yellow" }}
            onClick={approveProject}
          >
            Pending
          </Button>
        </div>
      )}
    </div>
  );
}
