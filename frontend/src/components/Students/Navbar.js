import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeUser } from "../../store/reducers/user";

export default function Navbar() {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [nav, setNav] = useState(true);
  const handleNav = () => {
    // // // // // console.log("clicked");
    setNav(!nav);
  };

  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    // // // // // console.log("rendered..");
  }, []);
  // // // // // console.log("ui");
  // // // // // console.log("user is ", user)
  return (
    <>
      <div className="flex space-x-10  h-[10%]  ">
        <div className="flex justify-between  px-2 py-2">
          <div className="justify-between h-24  ">
            <ul className=" hidden  w-full md:flex bg-purple-500 rounded-md ">
              {/* naming part */}

              {user ? (
                <li className="p-4">
                  <img src={user.pic} alt="loading" height={"50"} width={50} />
                </li>
              ) : (
                <li></li>
              )}
              {user ? (
                <li className="p-4">
                  <Link to={`/${user.position}/home`} data-testid = "name">{user.name}</Link>
                </li>
              ) : (
                <li></li>
              )}

              {user ? (
                <li className="p-4">
                  <Link to={`/${user.position}/edit-profile`}>
                    Edit Profile
                  </Link>
                </li>
              ) : (
                <li></li>
              )}
              {user ? (
                <li className="p-4">
                  <Link to={`/${user.position}/change-password`}>
                    Change Password
                  </Link>
                </li>
              ) : (
                <li></li>
              )}

              {user && user.position === "student" ? (
                <li className="p-4">
                  <Link to={"/student/create-project"}>Create Project</Link>
                </li>
              ) : (
                <li></li>
              )}

              {user && user.position === "student" ? (
                <li className="p-4">
                  <Link to={"/student/show-documents"}>Show Documents</Link>
                </li>
              ) : (
                <li></li>
              )}

              {user && user.position === "student" ? (
                <li className="p-4">
                  <Link to={"/student/show-projects"}>Show Projects</Link>
                </li>
              ) : (
                <li></li>
              )}
              {user && user.position === "student" ? (
                <li className="p-4">
                  <button
                    onClick={async () => {
                      const headers = {
                        authorization: "Bearer " + cookies.token,
                        "Access-Control-Allow-Origin": "*",
                      };
                      try {
                        await axios.get(
                          "http://localhost:5000/student/logout",
                          { headers, withCredentials: true }
                        );
                        dispatch(changeUser(null));
                        navigate("/");
                      } catch (error) {}
                    }}
                  >
                    LogOut
                  </button>
                </li>
              ) : (
                <li></li>
              )}
              {user && user.position === "admin" ? (
                <li className="p-4">
                  <button
                    onClick={async () => {
                      const headers = {
                        authorization: "Bearer " + cookies.token,
                        "Access-Control-Allow-Origin": "*",
                      };
                      try {
                        await axios.get(
                          "http://localhost:5000/admin/logout",
                          {
                            headers,
                            withCredentials: true,
                          }
                        );
                        dispatch(changeUser(null));
                        navigate("/");
                      } catch (error) {}
                    }}
                  >
                    LogOut
                  </button>
                </li>
              ) : (
                <li></li>
              )}
              {user && user.position === "teacher" ? (
                <li className="p-4">
                  <button
                    onClick={async () => {
                      const headers = {
                        authorization: "Bearer " + cookies.token,
                        "Access-Control-Allow-Origin": "*",
                      };
                      try {
                        await axios.get(
                          "http://localhost:5000/teacher/logout",
                          { headers, withCredentials: true }
                        );
                        dispatch(changeUser(null));

                        navigate("/");
                      } catch (error) {}
                    }}
                  >
                    LogOut
                  </button>
                </li>
              ) : (
                <li></li>
              )}
              {user && user.position === "deadStockManager" ? (
                <li className="p-4">
                  <button
                    onClick={async () => {
                      const headers = {
                        authorization: "Bearer " + cookies.token,
                        "Access-Control-Allow-Origin": "*",
                      };
                      try {
                        await axios.get(
                          "http://localhost:5000/dead-stocks/logout",
                          { headers, withCredentials: true }
                        );
                        dispatch(changeUser(null));

                        navigate("/");
                      } catch (error) {}
                    }}
                  >
                    LogOut
                  </button>
                </li>
              ) : (
                <li></li>
              )}
            </ul>
          </div>

          <div
            className={
              !nav
                ? "fixed mt-10 justify-between bg-green-300 left-0 h-[100%] w-[60%] py-3 ease-in-out duration-500"
                : "fixed left-[-100%]"
            }
          >
            <ul className="flex-col   ">
              {/* naming part */}

              {user ? (
                <li className="p-4 b-4">
                  <img src={user.pic} alt="loading" height={"50"} width={50} />
                </li>
              ) : (
                <li></li>
              )}
              {user ? (
                <li className="p-4 b-4">
                  <Link to={`/${user.position}/home`}>{user.name}</Link>
                </li>
              ) : (
                <li></li>
              )}

              {user ? (
                <li className="p-4 b-4">
                  <Link
                    to={`/${user.position}/edit-profile`}
                    onClick={handleNav}
                  >
                    Edit Profile
                  </Link>
                </li>
              ) : (
                <li></li>
              )}
              {user ? (
                <li className="p-4 b-4">
                  <Link to={`/${user.position}/change-password`}>
                    Change Password
                  </Link>
                </li>
              ) : (
                <li></li>
              )}

              {user && user.position === "student" ? (
                <li className="p-4 b-4">
                  <Link to={"/student/create-project"}>Create Project</Link>
                </li>
              ) : (
                <li></li>
              )}

              {user && user.position === "student" ? (
                <li className="p-4 b-4">
                  <Link to={"/student/show-documents"}>Show Documents</Link>
                </li>
              ) : (
                <li></li>
              )}

              {user && user.position === "student" ? (
                <li className="p-4 b-4">
                  <Link to={"/student/show-projects"}>Show Projects</Link>
                </li>
              ) : (
                <li></li>
              )}
              {user && user.position === "student" ? (
                <li className="p-4 b-4">
                  <button
                    onClick={async () => {
                      handleNav();
                      const headers = {
                        authorization: "Bearer " + cookies.token,
                        "Access-Control-Allow-Origin": "*",
                      };
                      try {
                        await axios.get(
                          "http://localhost:5000/student/logout",
                          { headers, withCredentials: true }
                        );
                        dispatch(changeUser(null));
                        navigate("/");
                      } catch (error) {}
                    }}
                  >
                    LogOut
                  </button>
                </li>
              ) : (
                <li></li>
              )}
              {user && user.position === "admin" ? (
                <li className="p-4 b-4">
                  <button
                    onClick={async () => {
                      handleNav();
                      const headers = {
                        authorization: "Bearer " + cookies.token,
                        "Access-Control-Allow-Origin": "*",
                      };
                      try {
                        await axios.get(
                          "http://localhost:5000/admin/logout",
                          {
                            headers,
                            withCredentials: true,
                          }
                        );
                        dispatch(changeUser(null));
                        navigate("/");
                      } catch (error) {}
                    }}
                  >
                    LogOut
                  </button>
                </li>
              ) : (
                <li></li>
              )}
              {user && user.position === "teacher" ? (
                <li className="p-4 b-4">
                  <button
                    onClick={async () => {
                      handleNav();
                      const headers = {
                        authorization: "Bearer " + cookies.token,
                        "Access-Control-Allow-Origin": "*",
                      };
                      try {
                        await axios.get(
                          "http://localhost:5000/teacher/logout",
                          { headers, withCredentials: true }
                        );
                        dispatch(changeUser(null));

                        navigate("/");
                      } catch (error) {}
                    }}
                  >
                    LogOut
                  </button>
                </li>
              ) : (
                <li></li>
              )}
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
    </>
  );
}
