import React from "react";
import "./AdminSidebar.css";
import Back from "../../assets/images/wback.svg";
import { useNavigate } from "react-router-dom";

function AdminSidebar({ selected }) {
  const navigate = useNavigate();

  const handleChange = (path) => {
    navigate(path);
  };

  return (
    <div className="adminsb-main">
      <ul className="adminsb-ul">
        <div className="adminsb-home" onClick={() => handleChange("/")}>
          <img src={Back} alt="back" className="adminsb-back" />
          <li>Home</li>
        </div>
        <li
          className={`adminsb-li ${
            selected === "dashboard" && "adminsb-active"
          }`}
          onClick={() => handleChange("/admin/dashboard")}
        >
          Dashboard
        </li>
        <li
          className={`adminsb-li ${selected === "blogs" && "adminsb-active"}`}
          onClick={() => handleChange("/admin/blogs")}
        >
          Blogs
        </li>
        <li
          className={`adminsb-li ${
            selected === "comments" && "adminsb-active"
          }`}
          onClick={() => handleChange("/admin/comments")}
        >
          Comments
        </li>
        <li
          className={`adminsb-li ${
            selected === "userVerification" && "adminsb-active"
          }`}
          onClick={() => handleChange("/admin/user-verification")}
        >
          User Verification
        </li>
        {/* <li
          className={`adminsb-li ${
            selected === "coupons" && "adminsb-active"
          }`}
          onClick={() => handleChange("/admin/coupons")}
        >
          Coupons
        </li> */}
        <li
          className={`adminsb-li ${
            selected === "promotedBlogs" && "adminsb-active"
          }`}
          onClick={() => handleChange("/admin/promotedBlogs")}
        >
        Promoted Blogs
        </li>
       
        <li
          className={`adminsb-li ${
            selected === "categories" && "adminsb-active"
          }`}
          onClick={() => handleChange("/admin/categories")}
        >
          Categories
        </li>
        <li
          className={`adminsb-li ${
            selected === "activebanners" && "adminsb-active"
          }`}
          onClick={() => handleChange("/admin/activebanners")}
        >
          Active Banners
        </li>
        {/* <li
          className={`adminsb-li ${
            selected === "seo" && "adminsb-active"
          }`}
          onClick={() => handleChange("/admin/seo")}
        >
          SEO
        </li> */}
      </ul>
    </div>
  );
}

export default AdminSidebar;
