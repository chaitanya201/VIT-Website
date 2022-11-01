import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Search({ setProjects, setAlertMsg, setAlertColor }) {
  const BASE_URL = "http://localhost:5000/";
  const delay = 300;
  const [query, setQuery] = useState("");
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.get(
          BASE_URL + "teacher/search?query=" + query.trim()
        );
        if (response.data.status === "success")
          return setProjects(response.data.projects);
        setAlertColor("red");
        setAlertMsg(response.data.msg);
      } catch (error) {
        setAlertColor("red");
        setAlertMsg("Server Error. Try again later.");
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

  const debounce = (func, delay) => {
    let timeoutId;
    return () => {
      if (timeoutId) {
        console.log("timeout cleared");
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func();
      }, delay);
    };
  };

  const wrapper = debounce(getProjects, delay);

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
    </div>
  );
}
