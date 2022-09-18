import React,{ useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Contact.css";
import ContactImg from "../../assets/images/contact.svg";
import Navbarr from "../common/Navbarr";
import Footer from "../common/Footer";
import axios from "../../utils/axios";

function Contact() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };
const contactForm =  async (e) => {
  e.preventDefault();
  if (!userData.name){
    alert('Username cannnot be empty')
  }
  else if (!userData.email){
    alert('E-mail cannnot be empty')
  }
  else if (!userData.subject){
    alert('Subject cannnot be empty')
  }
  else if (!userData.message){
    alert('Message cannnot be empty')
  }
  else{
    const data = {
      username: userData.name,
     email: userData.email,
     subject: userData.subject,
     message: userData.message,
    };
    try {
      const res = await axios.post('api/guest/message', data);
      alert(res?.data?.message);
    } catch (err) {
      console.log(err);
    }
    setUserData({name: "",
    email: "",
    subject: "",
    message: "",});
  }

}


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
                  placeholder="Enter Name"
                  name="name"
                  value={userData.name}
                   onChange={handleInputs}
                  required
                  className="contact-input"
                />
                <input
                  type="text"
                  placeholder="Enter Email id"
                  name="email"
                  value={userData.email}
                   onChange={handleInputs}
                  required
                  className="contact-input"
                />
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
                <button type="submit" className="contact-btn" onClick={contactForm}>
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
}

export default Contact;
