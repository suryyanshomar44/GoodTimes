import React from "react";
import "./Sidebar.css";
import Back from "../../assets/images/wback.svg";
import { useNavigate } from "react-router-dom";

function Sidebar({ selected }) {
  const navigate = useNavigate();

  const handleChange = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar-main">
      <ul className="sidebar-ul">
        <div className="sidebar-home" onClick={() => handleChange("/")}>
          <img src={Back} alt="back" className="sidebar-back" />
          <li>Home</li>
        </div>
        <li
          className={`sidebar-li ${
            selected === "dashboard" && "sidebar-active"
          }`}
          onClick={() => handleChange("/user/dashboard")}
        >
          Dashboard
        </li>
        <li
          className={`sidebar-li ${
            selected === "insights" && "sidebar-active"
          }`}
          onClick={() => handleChange("/user/insights")}
        >
          Insights
        </li>
        <li
          className={`sidebar-li ${selected === "blogs" && "sidebar-active"}`}
          onClick={() => handleChange("/user/blogs")}
        >
          Blogs
        </li>
        <li
          className={`sidebar-li ${
            selected === "comments" && "sidebar-active"
          }`}
          onClick={() => handleChange("/user/comments")}
        >
          Comments
        </li>
        <li
          className={`sidebar-li ${selected === "profile" && "sidebar-active"}`}
          onClick={() => handleChange("/user/profile")}
        >
          Profile
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
