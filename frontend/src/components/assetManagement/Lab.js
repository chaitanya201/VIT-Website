import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Lab() {
  const [lab, setLab] = useState({
    label: "ENTC-1101",
    value: "ENTC-1101",
  });

  console.log(lab);

  const [bench, setbench] = useState(null);
  const [workingBench, setworkingBench] = useState(null);
  const [notWorkingBench, setnotWorkingBench] = useState(null);
  const [fans, setfans] = useState(null);
  const [workingFans, setworkingFans] = useState(null);
  const [notWorkingFans, setnotWorkingFans] = useState(null);
  const [chair, setchair] = useState(null);
  const [workingChair, setworkingChair] = useState(null);
  const [notWorkingChair, setnotWorkingChair] = useState(null);
  const [light, setlight] = useState(null);
  const [workingLight, setworkingLight] = useState(null);
  const [notWorkingLight, setnotWorkingLight] = useState(null);
  const [data, setdata] = useState(null);

  const Laboptions = [
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
  const [cookies] = useCookies();

  const getdata = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        "http://localhost:5000/VIT-Assets/show-asstes-lab?" +
          "labName=" +
          lab.value,
        { headers: { authorization: "Bearer " + cookies.token } }
      );
      if (res.data.status === "success") {
        // setdata(res.data.asstes);
        setbench(res.data.asstes._doc.benches.total);
        setworkingBench(res.data.asstes._doc.benches.working);
        setnotWorkingBench(res.data.asstes._doc.benches.notWorking);
        setchair(res.data.asstes._doc.chair.total);
        setworkingChair(res.data.asstes._doc.chair.working);
        setnotWorkingChair(res.data.asstes._doc.chair.notWorking);
        setfans(res.data.asstes._doc.fans.total);
        setworkingFans(res.data.asstes._doc.fans.working);
        setnotWorkingFans(res.data.asstes._doc.fans.notWorking);
        setlight(res.data.asstes._doc.light.total);
        setworkingLight(res.data.asstes._doc.light.working);
        setnotWorkingLight(res.data.asstes._doc.light.notWorking);
        setdata(true);
      }
    } catch (error) {
      console.log(error);
      setdata(false);
    }
  };
  console.log(bench, "bench");
  console.log(chair, "chair");
  console.log(light, "light");
  console.log(fans, "fans");
  const setData = async (e) => {
    e.preventDefault();
    const up = {
      benches: bench,
      workingBench: workingBench,
      notWorkingBench: notWorkingBench,
      fans: fans,
      workingFans: workingFans,
      notWorkingFans: notWorkingFans,
      chair: chair,
      WorkingChair: workingChair,
      NotWorkingChair: notWorkingChair,
      light: light,
      WorkingLight: workingLight,
      notWorkingLight: notWorkingLight,
      labName: lab.value,
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/VIT-Assets/update-lab",
        up,
        { headers: { authorization: "Bearer " + cookies.token } }
      );
      console.log("RES = ", res.data);
      if (res.data.status === "success") {
        //setdata(res.data.asstes);
        //setbench(res.data.benches);
        //setchair(res.data.chair);
        //setlight(res.data.light);
        //setfans(res.data.fans);
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
        College Asset Management-Labs
      </h1>
      <form onSubmit={getdata}>
        <Select
          options={Laboptions}
          value={lab}
          onChange={(e) => {
            setLab({ label: e.label, value: e.value });
          }}
        ></Select>
        <input
          type="submit"
          value={"submit"}
          style={{ backgroundColor: "#BCE6FF" }}
        />
      </form>

      <form onSubmit={setData}>
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
                  setbench(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={workingBench}
                onChange={(e) => {
                  setworkingBench(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={notWorkingBench}
                onChange={(e) => {
                  setnotWorkingBench(e.target.value);
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
                  setchair(e.target.value);
                }}
              />
            </td>
            <td>
              <input
                type="number"
                value={workingChair}
                onChange={(e) => {
                  setworkingChair(e.target.value);
                }}
              />
            </td>
            <td>
              <input
                type="number"
                value={notWorkingChair}
                onChange={(e) => {
                  setnotWorkingChair(e.target.value);
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
                  setfans(e.target.value);
                }}
              />
            </td>
            <td>
              <input
                type="number"
                value={workingFans}
                onChange={(e) => {
                  setworkingFans(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={notWorkingFans}
                onChange={(e) => {
                  setnotWorkingFans(e.target.value);
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
                  setlight(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={workingLight}
                onChange={(e) => {
                  setworkingLight(e.target.value);
                }}
              />
            </td>

            <td>
              <input
                type="number"
                value={notWorkingLight}
                onChange={(e) => {
                  setnotWorkingLight(e.target.value);
                }}
              />
            </td>
          </tr>
        </table>
        <input type="submit" value={"submit"} />
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
