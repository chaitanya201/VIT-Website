import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./featuredInfo.css";


export default function FeaturedInfo() {
  const [working, setWorking] = useState(null)
  const [notWorkingRepairable, setNotWorkingRepairable] = useState(null)
  const [notWorkingnotRepairable, setNotWorkingNotRepairable] = useState(null)
  const [cookie] = useCookies()
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dead-stocks/getdata", {headers: {authorization : "Bearer " + cookie.token  }})
      if (response.data.status === "Success") {
        setWorking(response.data.working)
        setNotWorkingRepairable(response.data.NotWorkingRepairable)
        setNotWorkingNotRepairable(response.data.NotWorkingNotRepairable)
      }
      else{
        alert(response.data.msg)
      }
    } catch (error) {
      alert("Server Error")
    }
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Working &nbsp;&nbsp;&nbsp;</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{working}</span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Not Working but Repairable</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{notWorkingRepairable}</span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Not Working and Not Repairable</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{notWorkingnotRepairable}</span>
        </div>
      </div>
    </div>
  );
}