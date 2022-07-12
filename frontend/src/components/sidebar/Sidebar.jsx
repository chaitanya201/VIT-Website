import "./sidebar.css";
import { LineStyle, Storefront } from "@material-ui/icons";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/dead-stock/home" className="link">
              <li className="sidebarListItem active">
                <LineStyle className="sidebarIcon" />
                Home
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <ul className="sidebarList">
            <Link to="/dead-stock/productlist" className="link">
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                DeadStocks
              </li>
            </Link>
          </ul>
        </div>
        
      </div>
    </div>
  );
}
