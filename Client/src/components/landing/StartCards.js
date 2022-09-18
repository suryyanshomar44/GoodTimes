import React, { useState, useEffect } from "react";
import "./StartCards.css";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "../../utils/axios";
function StartCards() {
  const [data, setData] = useState();
  const [item1, setItem1] = useState();
  const GetData = () => {
    try {
      axios.get(`api/guest/promotedblogs`).then((response) => {
        setData(response.data.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    GetData();
  }, []);
  useEffect(() => {
    if (data?.length > 0) {
      setItem1(data[0]);
    }
  }, [data]);
  return (
    <Container className="start-main">
      <Row>
        <Col lg={7} className="start-col">
        <NavLink
                className="navlink-css"
                to={{pathname:`/particular-blog/${item1?._id}`}} state={{ blog_id: item1?._id }}
              >
          <div className="start-fit-img1">
            <img src={item1?.thumbnail} alt="scene1" className="start-img1" />
          </div>
          <div className="start-div">
            <span className="start-category">{item1?.category}</span>
            <div className="start-heading">{item1?.title}</div>
            <div className="start-subheading">
              {item1?.blogText.slice(0, 200)}...
            </div>
          </div>
          </NavLink>
        </Col>
        <Col lg={5}>
          <Row>
            {data?.slice(1, 5).map((item, id) => {
              return (
                <>
                  <Col md={6} className="start-col" key={id}>
                  <NavLink
                className="navlink-css"
                to={{pathname:`/particular-blog/${item?._id}`}} state={{ blog_id: item?._id }}
              >
                    <div className="start-fit-img">
                      <img
                        src={item?.thumbnail}
                        alt="scene2"
                        className="start-img"
                      />
                    </div>
                    <div className="start-sdiv">
                      <span className="start-scategory">{item?.category}</span>
                      <div className="start-sheading">{item?.title}</div>
                      <div className="start-ssubheading">
                        {item?.blogText.slice(0, 150)}...
                      </div>
                    </div>
                    </NavLink>
                  </Col>
                </>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default StartCards;
