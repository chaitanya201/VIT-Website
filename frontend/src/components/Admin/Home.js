import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import ClosingAlert from "../Auth/Alert";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Home() {
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertMsgColor, setAlertMsgColor] = useState("red");
  const [allTeachers, setAllTeachers] = useState(null);
  const [cookies] = useCookies();
  console.log("all", allTeachers);
  const headers = {
    authorization: "Bearer " + cookies.token,
    "Access-Control-Allow-Origin": "*",
  };
  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/get-all-teachers",
        { headers }
      );
      console.log("res", response.data);
      if (response.data.status !== "success") {
        setAlertMsg(response.data.msg);
        setAlertMsgColor("red");
      } else {
        setAlertMsg("Data found");
        setAlertMsgColor("green");
        setAllTeachers(response.data.allTeachers);
      }
    } catch (error) {
      console.log("error");
      console.log(error);
      setAlertMsg("Server Error. Try again later.");
      setAlertMsgColor("red");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const columns = [
    { field: "name", headerName: "Name", width: 300 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "",
      headerName: "Show",
      width: 300,
      renderCell: ({ row }) => {
        return (
          <div>
            <Link state={{ teacher: row }} to="/admin/show-teachers-projects">
              View
            </Link>
          </div>
        );
      },
    },
  ];

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
      <div>
        {allTeachers ? (
          <DataGrid
            columns={columns}
            autoHeight
            getRowId={(data) => data._id}
            rows={allTeachers}
          ></DataGrid>
        ) : (
          <div>No Record of Teachers found</div>
        )}
      </div>
    </div>
  );
}
