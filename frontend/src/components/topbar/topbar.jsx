import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeUser } from "../../store/reducers/user";

import "./topbar.css";

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies();
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">DeadStock Management</span>
        </div>
        <div className="topRight">
          <Link to="/dead-stock/newproduct">
            <button className="productAddButton">Create</button>
          </Link>
          <Link to="/dead-stock/classroom">
            <button className="productAddButton">Classroom</button>
          </Link>
          <Link to="/dead-stock/lab">
            <button className="productAddButton">Lab</button>
          </Link>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div
            className="button"
            onClick={async () => {
              const headers = {
                authorization: "Bearer " + cookies.token,
                "Access-Control-Allow-Origin": "*",
              };
              try {
                await axios.get("http://localhost:5000/dead-stocks/logout", {
                  headers,
                  withCredentials: true,
                });
                dispatch(changeUser(null));

                navigate("/");
              } catch (error) {}
            }}
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
