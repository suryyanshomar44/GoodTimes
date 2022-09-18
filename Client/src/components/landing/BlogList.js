import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./BlogList.css";
import { NavLink } from "react-router-dom";
import axios from "../../utils/axios";

function BlogList() {
  const [data, setData] = useState();

  useEffect(() => {
    function GetData() {
      try {
        axios.get(`api/user/getblogsviarating`).then((response) => {
          setData(response?.data?.blogs);
        });
      } catch (err) {
        console.log(err);
      }
    }

    GetData();
  }, []);


  return (
    <Container className="list-main">
      <div className="list-explore">
      Highest Rated<span> Posts</span>
      </div>
      {data?.slice(0, 5).map((data, id) => {
          
        return (
          <Row className="list-rows" key={id}>
            <Col lg={2} xs={3} md={3}>
              <div className="list-main-img">
              <img
                src={data?.thumbnail}
                alt={data?.title}
                className="list-img-landing"
              />
              </div>
            </Col>
            <Col lg={10} xs={9} md={9}>
            <NavLink
                className="navlink-css"
                to={{pathname:`/particular-blog/${data?._id}`}} state={{ blog_id: data?._id }}
              >
                <div className="list-content">
                  <div className="list-heading">{data?.title.slice(0, 40)}...</div>
                  <div className="list-subheading">
                    {data?.blogText.slice(0, 128)}...<span className="read-more-text">Read more</span>
                  </div>
                </div>
              </NavLink>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
}

export default BlogList;
