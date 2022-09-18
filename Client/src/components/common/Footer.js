import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import Logo from "../../assets/images/logo-removebg.png";
function Footer() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const handleClick = (path) => {
    navigate(path);
  };
  const Contact = () => {
    !user ? handleClick("contact") : handleClick("/user/contact");
  };
  return (
    <div className="footer-main">
      <Container>
        <Row className="footer-row">
          <Col md={5}>
            <div className="footer-div1">
              <div
                style={{
                  position: "relative",
                  height: "110px",
                  display: "flex",
                }}
              >
                <img src={Logo} alt="logo" height="100%" />
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="footer-div2">
              <h3>Quick Links</h3>
              <ul>
                <li
                  className="footer-list"
                  onClick={() => handleClick("/home")}
                >
                  Home
                </li>
                <li
                  className="footer-list"
                  onClick={() => handleClick("/blogs/allblogs/all")}
                >
                  Blogs
                </li>
                <li
                  className="footer-list"
                  onClick={() => handleClick("/blogs/subcategory=AI")}
                >
                  Categories
                </li>
          
                <li className="footer-list" onClick={Contact}>
                  Contact Us
                </li>
              </ul>
            </div>
          </Col>
          <Col md={4}>
            <div className="footer-div3">
              <button
                className="footer-button"
                onClick={() => handleClick("/submit")}
              >
                Submit Blog
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
