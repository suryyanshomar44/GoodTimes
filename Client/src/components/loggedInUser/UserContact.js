import React, { useState,useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../contact/Contact.css";
import ContactImg from "../../assets/images/contact.svg";
import Navbarr from "../common/Navbarr";
import Footer from "../common/Footer";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";

const UserContact = () => {
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    subject: "",
    message: "",
  });
  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };
  const contactForm = async (e) => {
    e.preventDefault();
     if (!userData.subject) {
      alert("Subject cannnot be empty");
    } else if (!userData.message) {
      alert("Message cannnot be empty");
    } else {
      const data = {
        subject: userData.subject,
        message: userData.message,
      };
      try {
        const res = await axios.post("api/user/message", data);
        alert(res?.data?.message);
      } catch (err) {
        console.log(err);
      }
      setUserData({ subject: "", message: "" });
    }
  };

  if (!isLoading && !user) navigate("/");
  if (isLoading) return null;

  return (
    <>
      <Navbarr />
      <Container className="contact-main">
        <Row>
          <Col lg={4} className="order-lg-2">
            <img src={ContactImg} alt="contact" className="contact-img" />
          </Col>
          <Col lg={8} className="order-lg-1">
            <div className="contact-form">
              <form>
                <input
                  type="text"
                  placeholder="Enter Subject"
                  name="subject"
                  value={userData.subject}
                  onChange={handleInputs}
                  required
                  className="contact-input"
                />
                <textarea
                  rows="10"
                  placeholder="Message"
                  onChange={handleInputs}
                  required
                  name="message"
                  value={userData.message}
                  className="contact-input"
                />
                <button
                  type="submit"
                  className="contact-btn"
                  onClick={contactForm}
                >
                  Submit
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default UserContact;
