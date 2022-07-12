import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Classroom() {
  const [classroom, setClassroom] = useState({
    label: "ENTC-1101",
    value: "ENTC-1101",
  });

  console.log(classroom);

  const [bench, setBench] = useState(null);
  const [workingBench, setWorkingBench] = useState(null);
  const [notWorkingBench, setNotWorkingBench] = useState(null);
  const [fans, setFans] = useState(null);
  const [workingFans, setWorkingFans] = useState(null);
  const [notWorkingFans, setNotWorkingFans] = useState(null);
  const [chair, setChair] = useState(null);
  const [workingChair, setWorkingChair] = useState(null);
  const [notWorkingChair, setNotWorkingChair] = useState(null);
  const [light, setLight] = useState(null);
  const [workingLight, setWorkingLight] = useState(null);
  const [notWorkingLight, setNotWorkingLight] = useState(null);
  const [data, setData] = useState(null);
  const [cookies] = useCookies();
  const classroomoptions = [
    {
      label: "ENTC-1100",
      value: "ENTC-1100",
    },
    {
      label: "ENTC-1101",
      value: "ENTC-1101",
    },
    {
      label: "ENTC-1102",
      value: "ENTC-1102",
    },
    {
      label: "ENTC-1103",
      value: "ENTC-1103",
    },
    {
      label: "ENTC-1104",
      value: "ENTC-1104",
    },
    {
      label: "ENTC-1105",
      value: "ENTC-1105",
    },
    {
      label: "ENTC-1106",
      value: "ENTC-1106",
    },
  ];

  const getData = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        "http://localhost:5000/VIT-Assets/show-asstes-classroom?" +
          "classroomName=" +
          classroom.value,
        { headers: { authorization: "Bearer " + cookies.token } }
      );
      if (res.data.status === "success") {
        setBench(res.data.asstes._doc.benches.total);
        setWorkingBench(res.data.asstes._doc.benches.working);
        setNotWorkingBench(res.data.asstes._doc.benches.notWorking);
        setChair(res.data.asstes._doc.chair.total);
        setWorkingChair(res.data.asstes._doc.chair.working);
        setNotWorkingChair(res.data.asstes._doc.chair.notWorking);
        setFans(res.data.asstes._doc.fans.total);
        setWorkingFans(res.data.asstes._doc.fans.working);
        setNotWorkingFans(res.data.asstes._doc.fans.notWorking);
        setLight(res.data.asstes._doc.light.total);
        setWorkingLight(res.data.asstes._doc.light.working);
        setNotWorkingLight(res.data.asstes._doc.light.notWorking);
        setData(true);
      }
    } catch (error) {
      console.log(error);
      setData(false);
    }
  };
  console.log(bench, "bench");
  console.log(chair, "chair");
  console.log(light, "light");
  console.log(fans, "fans");
  const setAllData = async (e) => {
    e.preventDefault();
    const up = {
      benches: bench,
      workingBench: workingBench,
      notWorkingBench: notWorkingBench,
      fans: fans,
      workingFans: workingFans,
      notWorkingFans: notWorkingFans,
      chair: chair,
      workingChair: workingChair,
      notWorkingChair: notWorkingChair,
      light: light,
      WorkingLight: workingLight,
      notWorkingLight: notWorkingLight,
      classroomName: classroom.value,
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/VIT-Assets/update-classroom",
        up,
        { headers: { authorization: "Bearer " + cookies.token } }
      );
      console.log("RES = ", res.data);
      if (res.data.status === "success") {
        //setdata(res.data.asstes);
        //setBench(res.data.benches);
        //setChair(res.data.chair);
        //setLight(res.data.light);
        //setFans(res.data.fans);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "10px 300px", position: "fixed", top: "200px" }}>
      <h1
        style={{
          fontSize: 24,
          margin: "0 auto",
          textAlign: "center",
          backgroundColor: "#CDF6FB",
          fontFamily: "serif",
        }}
      >
        College Asset Management-Classrooms
      </h1>
      <form onSubmit={getData}>
        <Select
          options={classroomoptions}
          value={classroom}
          onChange={(e) => {
            setClassroom({ label: e.label, value: e.value });
          }}
        ></Select>
        <input
          type="submit"
          value={"submit"}
          style={{ backgroundColor: "#BCE6FF" }}
        />
      </form>

      <form onSubmit={setAllData}>
        <table style={{ backgroundColor: "#F1A889" }}>
          <tr>
            <th> Sr.no </th>
            <th> Assests </th>
            <th> Total </th>
            <th> Working </th>
            <th> Not Working </th>
          </tr>

          <tr>
            <td> 1. </td>
            <td>Benches</td>
            <td>
              <input
                type="number"
                value={bench}
                onChange={(e) => {
                  setBench(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={workingBench}
                onChange={(e) => {
                  setWorkingBench(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={notWorkingBench}
                onChange={(e) => {
                  setNotWorkingBench(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td> 2. </td>
            <td>Chair</td>
            <td>
              <input
                type="number"
                value={chair}
                onChange={(e) => {
                  setChair(e.target.value);
                }}
              />
            </td>
            <td>
              <input
                type="number"
                value={workingChair}
                onChange={(e) => {
                  setWorkingChair(e.target.value);
                }}
              />
            </td>
            <td>
              <input
                type="number"
                value={notWorkingChair}
                onChange={(e) => {
                  setNotWorkingChair(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td> 3. </td>
            <td>Fans</td>
            <td>
              <input
                type="number"
                value={fans}
                onChange={(e) => {
                  setFans(e.target.value);
                }}
              />
            </td>
            <td>
              <input
                type="number"
                value={workingFans}
                onChange={(e) => {
                  setWorkingFans(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={notWorkingFans}
                onChange={(e) => {
                  setNotWorkingFans(e.target.value);
                }}
              />
            </td>
          </tr>

          <tr>
            <td> 4. </td>
            <td>Lights</td>
            <td>
              <input
                type="number"
                value={light}
                onChange={(e) => {
                  setLight(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={workingLight}
                onChange={(e) => {
                  setWorkingLight(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={notWorkingLight}
                onChange={(e) => {
                  setNotWorkingLight(e.target.value);
                }}
              />
            </td>
          </tr>
        </table>
        <input
          type="submit"
          value={"submit"}
          style={{ backgroundColor: "#BCE6FF" }}
        />
      </form>
      {data ? (
        <table
          style={{ backgroundColor: "#BCE6FF", border: "1px solid black" }}
        >
          <tbody>
            <tr>
              <th style={{ border: "1px solid black" }}>Assets</th>
              <th style={{ border: "1px solid black" }}>Total</th>
              <th style={{ border: "1px solid black" }}>Working</th>
              <th style={{ border: "1px solid black" }}>Not working</th>
            </tr>
            <tr>
              <td style={{ border: "1px solid black" }}>Benches</td>
              <td style={{ border: "1px solid black" }}>{bench} </td>
              <td style={{ border: "1px solid black" }}>{workingBench} </td>
              <td style={{ border: "1px solid black" }}>{notWorkingBench} </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid black" }}>Chairs</td>
              <td style={{ border: "1px solid black" }}>{chair} </td>
              <td style={{ border: "1px solid black" }}>{workingChair}</td>
              <td style={{ border: "1px solid black" }}>{notWorkingChair}</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid black" }}>Lights</td>
              <td style={{ border: "1px solid black" }}>{light} </td>
              <td style={{ border: "1px solid black" }}>{workingLight}</td>
              <td style={{ border: "1px solid black" }}>{notWorkingLight}</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid black" }}>Fans</td>
              <td style={{ border: "1px solid black" }}>{fans} </td>
              <td style={{ border: "1px solid black" }}>{workingFans}</td>
              <td style={{ border: "1px solid black" }}>{notWorkingFans}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <span> NO data Found </span>
      )}
    </div>
  );
}
