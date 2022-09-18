import React from "react";
import "./Brand.css";
import { Container, Row, Col } from "react-bootstrap";
import YellowStar from "../../assets/images/yellowStar.svg";
import Flag from "../../assets/images/flag.svg";
import Code from "../../assets/images/code.svg";
import CouponCard from "../common/CouponCard";
import Navbarr from "../common/Navbarr";
import Footer from "../common/Footer";

function Brand() {
  return (
    <>
      <Navbarr />
      <Container className="brand-main">
        <Row>
          <Col lg={4}>
            <div className="brand-name">Brand</div>
          </Col>
          <Col lg={7}>
            <div className="brand-text">
              <span>
                Samsung discount offers and discount codes ◦ December 2021
              </span>
              <br />
              Find the latest Samsung discount codes and discount coupons here.
              Buy for less!
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={4}>
            <div className="brand-box">
              <div className="brand-rh">
                <div className="brand-rl">Rating Brand</div>
                <div className="brand-rr">(278 reviews)</div>
              </div>
              <img src={YellowStar} alt="star" className="brand-star" />
              <img src={YellowStar} alt="star" className="brand-star" />
              <img src={YellowStar} alt="star" className="brand-star" />
              <img src={YellowStar} alt="star" className="brand-star" />
              <img src={YellowStar} alt="star" className="brand-star" />
              <div className="brand-contact">
                <span>Contact</span>
                <br />
                Copy Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Blandit at massa, neque vitae ut non quisque.
                <br /> +91-9999-888-777
              </div>
            </div>
            <div className="brand-box">
              <div className="brand-oh">
                Check out offers in other countries
              </div>
              <Row>
                <Col lg={4}>
                  <div className="brand-div">
                    <img src={Flag} alt="flag" className="brand-flag" />
                    <span>USA</span>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="brand-div">
                    <img src={Flag} alt="flag" className="brand-flag" />
                    <span>USA</span>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="brand-div">
                    <img src={Flag} alt="flag" className="brand-flag" />
                    <span>USA</span>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="brand-div">
                    <img src={Flag} alt="flag" className="brand-flag" />
                    <span>USA</span>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="brand-div">
                    <img src={Flag} alt="flag" className="brand-flag" />
                    <span>USA</span>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="brand-div">
                    <img src={Flag} alt="flag" className="brand-flag" />
                    <span>USA</span>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="brand-div">
                    <img src={Flag} alt="flag" className="brand-flag" />
                    <span>USA</span>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="brand-div">
                    <img src={Flag} alt="flag" className="brand-flag" />
                    <span>USA</span>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="brand-div">
                    <img src={Flag} alt="flag" className="brand-flag" />
                    <span>USA</span>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={8}>
            <div className="brand-offer">
              <img src={Code} alt="code" className="brand-code" />
              <div className="brand-oc">
                <span>15% Off on Multibuys at Decathlon Discount Code</span>
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Accumsan nunc nulla commodo, sed ac volutpat donec. Risus auctor
                eu nisl, porta lacinia hendrerit nisi.
              </div>
              <button className="brand-btn">Get the deal</button>
            </div>
            <div className="brand-offer">
              <img src={Code} alt="code" className="brand-code" />
              <div className="brand-oc">
                <span>15% Off on Multibuys at Decathlon Discount Code</span>
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Accumsan nunc nulla commodo, sed ac volutpat donec. Risus auctor
                eu nisl, porta lacinia hendrerit nisi.
              </div>
              <button className="brand-btn">Get the deal</button>
            </div>
            <div className="brand-offer">
              <img src={Code} alt="code" className="brand-code" />
              <div className="brand-oc">
                <span>15% Off on Multibuys at Decathlon Discount Code</span>
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Accumsan nunc nulla commodo, sed ac volutpat donec. Risus auctor
                eu nisl, porta lacinia hendrerit nisi.
              </div>
              <button className="brand-btn">Get the deal</button>
            </div>
            <div className="brand-offer">
              <img src={Code} alt="code" className="brand-code" />
              <div className="brand-oc">
                <span>15% Off on Multibuys at Decathlon Discount Code</span>
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Accumsan nunc nulla commodo, sed ac volutpat donec. Risus auctor
                eu nisl, porta lacinia hendrerit nisi.
              </div>
              <button className="brand-btn">Get the deal</button>
            </div>
          </Col>
        </Row>
        <div className="brand-heading">
          Similar <span>Promo Codes</span>
        </div>
        <Row>
          <CouponCard />
          <CouponCard />
          <CouponCard />
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Brand;
