import "./chart.css";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { useCookies } from "react-cookie";
export default function Newchart() {
  const [working, setWorking] = useState(null);
  const [notWorkingRepairable, setNotWorkingRepairable] = useState(null);
  const [notWorkingnotRepairable, setNotWorkingNotRepairable] = useState(null);
  const [cookie] = useCookies()
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dead-stocks/getdata", {headers : {authorization : "Bearer " + cookie.token}});
      if (response.data.status === "Success") {
        setWorking(response.data.working);
        setNotWorkingRepairable(response.data.NotWorkingRepairable);
        setNotWorkingNotRepairable(response.data.NotWorkingNotRepairable);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Server Error");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const pieData = [
    {
      name: "Working",
      value: working,
    },
    {
      name: "Not Working but Repairable",
      value: notWorkingRepairable,
    },
    {
      name: "Not Working and Not Repairable",
      value: notWorkingnotRepairable,
    },
  ];
  const COLORS = ["#2E86C1", "#7B241C", "#DE3163"];
  return (
    <>
      <div className="chart">
        <h3 className="chartTitle">DeadStock Analytics</h3>
        <ResponsiveContainer width="100%" aspect={4 / 1}>
          <PieChart width={730} height={300}>
            <Pie
              data={pieData}
              color="#000000"
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
