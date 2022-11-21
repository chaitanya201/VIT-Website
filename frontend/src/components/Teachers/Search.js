import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Typography } from "@material-ui/core";
import AddSearchedProject from "./AddSearchedProject";

export default function Search({ setAlertMsg, setAlertColor }) {
  const BASE_URL = "http://localhost:5000/";
  const delay = 1000;
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim() === "") return;
      try {
        const response = await axios.get(
          BASE_URL + "teacher/search?query=" + query.trim()
        );
        console.log("res = ", response.data.projects);
        if (response.data.status === "success")
          return setProjects(response.data.projects);
        // setAlertColor("red");
        // setAlertMsg(response.data.msg);
      } catch (error) {
        console.log("error ");
        console.log(error);
        // setAlertColor("red");
        // setAlertMsg("Server Error. Try again later.");
      }
    }, delay);
    getProjects();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);
  const getProjects = async () => {
    console.log("called");
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      minWidth: 500,
      flex: 1,
    },

    {
      field: "students.name",
      headerName: "Name",
      minWith: 500,
      width: 300,
      // minHeight:300,
      renderCell: (params) => {
        // // // console.log("params are ", params);
        return (
          <div className="w-full space-y-1">
            {params.row.students.map((val) => {
              return (
                <div id={val._id}>
                  <Typography align="center">{val.name}</Typography>
                  <hr />
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      field: "abstract",
      headerName: "View",
      minWith: 500,
      width: 300,
      renderCell: (params) => {
        return (
          <div className="w-full space-y-1">
            <AddSearchedProject project={params.row} />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query}
          placeholder="Type here to search..."
        />
      </div>
      <div>
        {projects && projects.length > 0 ? (
          <DataGrid
            rows={projects}
            columns={columns}
            autoHeight
            rowHeight={400}
            getRowId={(data) => data._id}
          ></DataGrid>
        ) : (
          <div>No projects found</div>
        )}
      </div>
    </div>
  );
}
