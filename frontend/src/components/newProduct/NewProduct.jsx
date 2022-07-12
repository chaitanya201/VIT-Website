import "./newProduct.css";
import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import axios from "axios";
//import { useHistory } from "react-router-dom";
import Select from "react-select";
import { useCookies } from "react-cookie";

export default function NewProduct() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState();
  const [cost, setCost] = useState();
  const [condition, setCondition] = useState({
    label: "Working",
    value: "Working",
  });
  console.log("condition", condition);
  const [date, setDate] = useState("2017-05-24");
  const [image, setFile] = useState("");

  const options = [
    { label: "Working", value: "Working" },
    {
      label: "Not Working but Repairable",
      value: "Not Working but Repairable",
    },
    {
      label: "Not Working and Not Repairable",
      value: "Not Working and Not Repairable",
    },
  ];
  console.log("data is ", date);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("Image", image);
  };
  const [cookie] = useCookies();
  //  const [newProductsData, setnewProductsData] = useState(null)
  //const history = useHistory()
  const newProduct = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const data = new FormData();
    data.append("name", name);
    data.append("quantity", quantity);
    data.append("condition", condition.value);
    data.append("date", date);
    data.append("cost", cost);
    data.append("componentImage", image);

    try {
      const newProductsData = await axios.post(
        "http://localhost:5000/dead-stocks/newproduct",
        data,
        {
          headers: { authorization: "Bearer " + cookie.token },
          withCredentials: true,
        }
      );
      console.log("New product", newProductsData);
      if (newProductsData.data.status === "Success") {
        alert("Data added successfully");
      } else {
        alert(newProductsData.data.msg);
      }
      // history.push("/")
    } catch (error) {
      if (error.response) {
        console.log(error);
      }
    }
  };

  return (
    <div className="newProduct">
      <h1
        className="addProductTitle"
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: 30,
          paddingBottom: "2px",
        }}
      >
        <b>New Product</b>
      </h1>
      <form className="addProductForm" onSubmit={newProduct}>
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            required={true}
            id="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="addProductItem">
          <label>Name</label>
          <input
            type="text"
            placeholder="Apple Airpods"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="addProductItem">
          <label>Quantity</label>
          <input
            type="Number"
            placeholder="123"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="addProductItem">
          <label>Cost</label>
          <input
            type="Number"
            placeholder="In Rs"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <div className="addProductItem">
          <label>Condition</label>
          <Select
            options={options}
            value={condition}
            onChange={(e) => {
              setCondition({ label: e.label, value: e.value });
            }}
          ></Select>
          <br></br>
          <label>Choose Date of Purchase</label>
          <TextField
            id="date"
            type="date"
            defaultValue="2017-05-24"
            InputLabelProps={{
              shrink: true,
            }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <input type="submit" value={"Create"} className="addProductButton" />
      </form>
    </div>
  );
}
