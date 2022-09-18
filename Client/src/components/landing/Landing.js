import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import BlogList from "./BlogList";
import Cards from "../common/Cards";
import MajorCards from "../common/MajorCards";
import Related from "../common/Related";
import CardWithList from "./CardWithList";
import "./Landing.css";
import StartCards from "./StartCards";
import Navbarr from "../common/Navbarr";
import Footer from "../common/Footer";

function Landing() {
  return (
    <>
      <Navbarr />
      <Container className="landing-main">
        <StartCards />
        <Row>
          <Col lg={8}>
            <BlogList />
          </Col>
          <Col lg={4}>
            <Related />
          </Col>
        </Row>
        <MajorCards />
        <CardWithList />
        {/* <Cards /> */}
      </Container>

      <Footer />
    </>
  );
}

export default Landing;
