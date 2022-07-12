import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import welcomeimg from "./welcome.png";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate()

  const handlesubmit = (event) => {
    event.Default();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const login = () => {
    try {
      axios
        .post("http://localhost:5000/dead-stocks/login", user, { withCredentials: true})
        .then((res) => {
          if (res.data.status !== "success") {
            // alert(res.data.msg);
            return;
          }
          console.log("res", res);
          navigate('/dead-stock/home')
        });
    } catch (error) {
      alert("Please try again later");
    }
  };

  return (
    <div className="main-login">
      <div className="login-contain">
        <div className="left-side">
          <div className="img-class">
            <img src={logo} alt="img-id" />
          </div>
          <form onSubmit={handlesubmit}>
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              id="emil1"
            />
            <label for="pwd1">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              id="pwd1"
            />
            <button type="button" id="sub_butt" onClick={login}>
              Login
            </button>
          </form>

          <div className="footer">
            <h4 >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
              Don't have an Account ?</h4>
            <b>
              <h3>
                <Link className="link" to="/dead-stock/register">
                  Register Now
                </Link>
              </h3>
            </b>
          </div>
        </div>

        <div className="right-side">
          <div className="welcomNote">
          <br></br>
          <h1 style={{fontSize: 25}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <b>Welcome Back!</b> </h1>
          </div>

          <div className="welcomeImg">
            <img src={welcomeimg} id="wel-img-id" alt="" srcset="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
