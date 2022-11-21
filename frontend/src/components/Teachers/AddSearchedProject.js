import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import searchedProject from "../../store/reducers/searchedProject";

export default function AddSearchedProject({ project }) {
  const dispatch = useDispatch();

  return (
    <div>
      <button
        onClick={() => {
          dispatch(searchedProject({ ...project }));
        }}
      >
        <Link to={'/teacher/searched-project'}>View</Link>{" "}
      </button>
    </div>
  );
}
