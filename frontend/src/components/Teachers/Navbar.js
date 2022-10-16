import React from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [cookies,removeCookie] = useCookies();
  console.log(cookies.student);
  const navigate = useNavigate();
  return (
    <div className="flex space-x-10">
      <h1><Link to={'/student/home'} data-testid="name">{cookies.teacher.name}</Link></h1>
      <ul className="flex space-x-2">
        <li>
        <Link to={'/teacher/show-pending-projects'}>Show Pending Projects</Link>
        </li>
        <li>
        <Link to={'/teacher/show-approved-projects'}>Show Approved Projects</Link>
        </li>

        <li>
        <Link to={'/teacher/show-documents'}>Show Project Documents</Link>
        </li>
        <li>
          <button
            onClick={() => {
              removeCookie("teacher");
              removeCookie("teacherToken");
              navigate("/teacher-login");
            }}
          >
            LogOut
          </button>
        </li>
      </ul>
    </div>
  );
}
