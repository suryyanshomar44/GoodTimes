import React, { useContext } from "react";
import "./Header.css";
import User from "../../assets/images/user.svg";
import Menu from "../../assets/images/Hamberger-menu.svg";
import { Container } from "react-bootstrap";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";

function Header({ setSidebarShow, sidebarShow }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const logout = async () => {
    try {
      await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      navigate("/");
      window.location.reload();
      localStorage.clear();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="header-main">
      <Container>
        <div className="header-content">
          <img
            src={Menu}
            alt="menu"
            className="header-menu"
            onClick={() => setSidebarShow(!sidebarShow)}
          />
          <div>
            <img
              src={user?.profile || User}
              alt="user"
              className="header-img"
            />
            <span className="header-username header-pad">
              {user?.username
                ? user.username
                : user?.isAdmin
                ? "Admin"
                : "Username"}
            </span>
            <button
              className="header-logout header-pad"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </div>
      </Container>
      {/* <hr className="header-hr" /> */}
    </div>
  );
}

export default Header;
