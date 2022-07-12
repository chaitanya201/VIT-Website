import "./productList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
// import { productRows } from "../../components/homepage/dummyData";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cookies, useCookies } from "react-cookie";

export default function ProductList() {
  const [data, setData] = useState(null);
  const [cookie] = useCookies();
  console.log("In product list");
  const [err, setError] = useState(null);

  const getProducts = async () => {
    let response;
    console.log("Getting data");
    try {
      response = await axios.get(
        "http://localhost:5000/dead-stocks/getproducts",
        { headers: { authorization: "Bearer " + cookie.token } }
      );
      console.log(response, "res");
      if (response.data.status === "Success") {
        console.log("Data success");
        setData(response.data.allProducts);
        console.log("Data is", response.data.allProducts);
      }
    } catch (error) {
      alert("Server Error.");
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  const columns = [
    //  { field: "id", headerName: "ID", width: 100 },
    {
      field: "product",
      headerName: "Product",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img
              className="productListImg"
              src={"http://localhost:5000/component/" + params.row.image}
              alt=""
            />
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 200,
      renderCell: (params) => {
        return <div className="productListItem">{params.row.quantity}</div>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 250,
      renderCell: (params) => {
        return <div className="productListItem">{params.row.condition}</div>;
      },
    },
    {
      field: "price",
      headerName: "Price (in Rs)",
      width: 200,
      renderCell: (params) => {
        return <div className="productListItem">{params.row.cost}</div>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        console.log(params.row, "Params.........");
        return (
          <>
            <Link to={'/dead-stock/edit-product'} state = {{ data: params.row }}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={async () => {
                try {
                  const response = await axios.delete(
                    "http://localhost:5000/dead-stocks/deleteproduct?productId=" +
                      params.row._id,
                    { headers: { authorization: "Bearer " + cookie.token } }
                  );
                  if (response.data.status === "Success") {
                    alert("Data deleted successfully");
                    getProducts();
                  } else {
                    alert(response.data.message);
                  }
                } catch (error) {
                  alert("Server error, try again later");
                }
              }}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">
      {data ? (
        <DataGrid
          id={Math.random()}
          getRowId={(data) => data._id}
          rows={data}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
          checkboxSelection
          autoHeight
        />
      ) : (
        <span>No data found</span>
      )}
    </div>
  );
}
