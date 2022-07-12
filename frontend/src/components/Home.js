import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import DeadStock from "../Images/Dead Stock.jpeg";
import ProjectManagement from "../Images/Project Management.jpeg";
import Teacher from "../Images/teacher.jpeg";
import Background from "../Images/background.jpg";

export default function Home() {
  const [nav, setNav] = useState(true);
  const handleNav = () => {
    console.log("clicked");
    setNav(!nav);
  };
  return (
    <div>
      <div className="flex justify-between">
        <div className="justify-between   ">
          <ul className=" hidden w-full md:flex bg-purple-500 justify-between ">
            <li className="p-4">
              <Link to={"/dead-stock/register"}>Dead Stock Register</Link>
            </li>
            <li className="p-4">
              <Link to={"/dead-stock/login"}>Dead Stock Login</Link>
            </li>
            <li className="p-4">
              <Link to={"/teacher-register"}>Teacher Sign Up</Link>
            </li>
            <li className="p-4">
              <Link to={"/teacher-login"}>Teacher Sign In</Link>
            </li>
            <li className="p-4">
              <Link to={"/admin-register"}>Admin Sign Up</Link>
            </li>
            <li className="p-4">
              <Link to={"/admin-login"}>Admin Sign In</Link>
            </li>
            <li className="p-4">
              <Link to={"/register"}>Sign Up</Link>
            </li>
            <li className="p-4">
              <Link to={"/login"}>Sign In</Link>
            </li>
          </ul>
          <div className=" sm:flex lg:bg-green-400  2xl:bg-cyan-400 xl:flex-row md:flex-row lg:flex-row 2xl:flex-row md:bg-violet-800 sm:bg-pink-500 sm:flex-col ml-0 mr-0 mb-0  px-0 space-x-0 overflow-hidden ">
            <div>
              <img src={Background} alt="" />
            </div>
          </div>
        </div>

        <div
          className={
            !nav
              ? "fixed mt-10 justify-between bg-green-300 left-0 h-[100%] w-[60%] py-3 ease-in-out duration-500"
              : "fixed left-[-100%]"
          }
        >
          <ul className="flex-col   ">
            <li className="p-4 border-b">
              <Link to={"/register"}>Sign Up</Link>
            </li>
            <li className="p-4 border-b">
              <Link to={"/login"}>Sign In</Link>
            </li>
            <li className="p-4 border-b">
              <Link to={"/teacher-register"}>Teacher Sign Up</Link>
            </li>
            <li className="p-4 border-b">
              <Link to={"/teacher-login"}>Teacher Sign In</Link>
            </li>
            <li className="p-4">
              <Link to={"/admin-register"}>Admin Sign Up</Link>
            </li>
            <li className="p-4">
              <Link to={"/admin-login"}>Admin Sign In</Link>
            </li>
            <li className="p-4">
              <Link to={"/dead-stock/register"}>Dead Stock Register</Link>
            </li>
            <li className="p-4">
              <Link to={"/dead-stock/login"}>Dead Stock Login</Link>
            </li>
          </ul>
        </div>
        <div className=" px-2 py-2  md:hidden ">
          {nav ? (
            <AiOutlineMenu size={20} onClick={handleNav} />
          ) : (
            <AiOutlineClose size={20} onClick={handleNav} />
          )}
        </div>
      </div>
    </div>
  );
}
