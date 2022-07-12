import React from "react"
import "./homepage.css"
import Topbar from "../topbar/topbar";
import Sidebar from "../sidebar/Sidebar";
import Home from "../home/home";
import ProductList from "../productList/ProductList";
import Product from "../product/Product";
import NewProduct from "../newProduct/NewProduct";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import Login from "../login/login";
function Homepage() {
  const [user, setLoginUser] = useState({})

  
  return (
    <Router>
      <Route>
        
      </Route>

      <div className="container">
        <Sidebar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/products">
            <ProductList />
          </Route>
          <Route path="/product">
            <Product />
          </Route>
          <Route path="/newproduct">
            <NewProduct />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default Homepage;