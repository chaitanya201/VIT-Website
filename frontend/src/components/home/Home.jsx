import FeaturedInfo from "../featuredInfo/FeaturedInfo";
import "./home.css";
// import {userData} from "../homepage/dummyData";
import Newchart from "../chart/NewChart";

export default function Home() {
  return (
    <div className="home">
      <FeaturedInfo />
      <Newchart  title="User Analytics" grid dataKey="Active User"/>
      
    </div>
  );
}