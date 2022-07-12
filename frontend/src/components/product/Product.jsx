import { Link } from "react-router-dom";
import "./product.css";
import Select from "react-select";
//import Chart from "../../components/chart/Chart"
//import {productData} from "../../components/homepage/dummyData"
import { Publish } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Product() {
  const location = useLocation();
  console.log(location.state);
  const [cookie] = useCookies();
  try {
    var { data } = location.state;
  } catch (error) {}
  console.log("Data.. is ", data);
  const [image, setImage] = useState(data ? data.image : "");
  const [cost, setCost] = useState(data ? data.cost : "");
  const [name, setName] = useState(data ? data.name : "");
  const [date, setDate] = useState(data ? data.date : "");
  const [quantity, setQuantity] = useState(data ? data.quantity : "");
  const [condition, setCondition] = useState({
    label: data ? data.condition : "INVALID",
    value: data ? data.condition : "INVALID",
  });
  console.log("data = ", date);
  
  const [image1, setImage1] = useState(data ? data.image : "");
  const [cost1, setCost1] = useState(data ? data.cost : "");
  const [name1, setName1] = useState(data ? data.name : "");
  const [date1, setDate1] = useState(data ? data.date : "");
  const [quantity1, setQuantity1] = useState(data ? data.quantity : "");
  const [condition1, setCondition1] = useState(data ? data.condition : "");
  
  console.log(data, "Data..........");
  console.log(condition, "Condition...........");
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

  const formSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");
    try {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("quantity", quantity);
      formdata.append("condition", condition.value);
      formdata.append("date", date);
      formdata.append("cost", cost);
      formdata.append("productId", data._id);
      formdata.append("componentImage", image);

      const response = await axios.put(
        "http://localhost:5000/dead-stocks/updateproduct",
        formdata,
        { headers: { authorization: "Bearer " + cookie.token } }
      );
      console.log("Response is", response);
      if (response.data.status === "Success") {
        setCost1(response.data.product.cost);
        setCondition1(response.data.product.condition);
        setName1(response.data.product.name);
        setDate1(response.data.product.date);
        setQuantity1(response.data.product.quantity);
        setImage1(response.data.product.image);
        console.log("Data pass");
        alert("Data updated successfully");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("error while sending the request");
      console.log(error);
      alert("Server error");
    }
  };
  if (!data) {
    return <div>Visit this page through proper steps only.</div>;
  }

  return (
    <div className="product">
      <div className="productTop">
        <div className="productTopRight">
          <div className="productInfoTop">
            <img
              src={"http://localhost:5000/component/" + image1}
              alt=""
              className="productInfoImg"
            />
            <span className="productName">Electronics</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">Name</span>
              <span className="productInfoValue">{name1}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Quantity</span>
              <span className="productInfoValue">{quantity1}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Condition:</span>
              <span className="productInfoValue">{condition1}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Date:</span>
              <span className="productInfoValue">{date1}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Cost:</span>
              <span className="productInfoValue">{cost1}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm" onSubmit={formSubmit}>
          <div className="productFormLeft">
            <label>Product Name</label>
            <input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Product Name"
              value={name}
              required={true}
            />

            <label> Price (in Rs)</label>
            <input
              type="number"
              onChange={(e) => {
                setCost(e.target.value);
              }}
              placeholder="Product Cost (in Rs)"
              value={cost}
              required={true}
            />

            <label>Quantity</label>
            <input
              type="number"
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              placeholder="Quantity"
              value={quantity}
              required={true}
            />

            <label>Condition</label>
            <Select
              options={options}
              value={condition}
              onChange={(e) => {
                setCondition({ label: e.label, value: e.value });
              }}
            ></Select>

            <label>Choose Date of Purchase</label>
            <TextField
              id="date"
              type="date"
              defaultValue={date}
              onChange={(e) => {
                setDate(e.target.value);
                console.log(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              {typeof image !== "string" ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  className="productUploadImg"
                />
              ) : (
                <span>No preview available</span>
              )}
              <label>
                <Publish />
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
            </div>
          <div style={{ width:"10%"}}>
            <input
              style={{ backgroundColor: "limegreen", padding:"5px" }}
              type="submit"
              value={"Update"}
            />
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}
