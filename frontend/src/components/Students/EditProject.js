import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import ClosingAlert from "../Auth/Alert";

export default function EditProject() {
  const location = useLocation();
  const [alertColor, setAlertColor] = useState("red");
  const [alertMsg, setAlertMsg] = useState(null);
  try {
    var { project } = location.state;
  } catch (error) {}
  const [cookies] = useCookies();

  const [updatedProject, setUpdatedProject] = useState(project);
  const [title, setTitle] = useState(
    updatedProject ? updatedProject.title : ""
  );
  const [abstract, setAbstract] = useState(
    updatedProject ? updatedProject.abstract : ""
  );
  const user = useSelector((state) => state.user.user);

  if (!project) {
    return (
      <div className="bg-red-500">
        Visit this page through right procedure only.
      </div>
    );
  }

  const formSubmit = async (e) => {
    e.preventDefault();
    if (title.length < 4) {
      setAlertMsg("title should be at least 4 characters");
      setAlertColor("red");
      return;
    }
    if (abstract.split(" ").length < 15) {
      setAlertMsg("abstract should be at least 15 words");
      setAlertColor("red");
      return;
    }
    const headers = {
      authorization: "Bearer " + cookies.token,
      "Access-Control-Allow-Origin": "*",
    };

    const newProject = { title, abstract };
    try {
      const response = await axios.patch(
        `http://localhost:5000/projects/update-project?studentId=${
          user ? user._id : "123"
        }`,
        newProject,
        { headers }
      );
      if (response.data.status !== "success") {
        setAlertMsg(response.data.msg);
        setAlertColor("red");
      } else {
        setUpdatedProject(response.data.project);
        setAlertMsg("Project Updated");
        setAlertColor("green");
      }
    } catch (error) {
      setAlertMsg("Server Error. Try again later");
      setAlertColor("red");
    }
  };
  return (
    <div className="bg-slate-200">
      <div>
        {alertMsg ? (
          <ClosingAlert msg={alertMsg} alertColor={alertColor} />
        ) : (
          <span></span>
        )}
      </div>
      <div className="text-center">
        <div className="flex-col space-x-1 py-9 px-9 bg-white m-20 rounded-lg shadow-lg overflow-auto mt-0">
          <label className="uppercase font-bold text-lg">Title</label>
          <div className="text-3xl  font-serif">
            <form onSubmit={formSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <input
                type="text"
                value={abstract}
                onChange={(e) => {
                  setAbstract(e.target.value);
                }}
              />

              <button>
                <input type="submit" value={"UPDATE"} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
