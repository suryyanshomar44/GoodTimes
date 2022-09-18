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
        axios.get(`api/guest/recentblogs`).then((response) => {
          setData(response.data.data);
        });
      } catch (err) {
        console.log(err);
      }
    }

    GetData();
  }, []);


  return (
    <Container className="list-main pt-5">
      <div className="list-explore">
     All<span> Blogs</span>
      </div>
      {data?.slice(-10)?.reverse()?.map((data, id) => {
          
        return (
          <Row className="list-row" key={id}>
            <Col  lg={2} xs={3} md={3}>
            <div className="list-main-img">
              <img
                src={data?.thumbnail}
                alt={data?.title}
                className="list-img-blogs"
              />
              </div>
            </Col>
            <Col lg={10} xs={9} md={9}>
              <NavLink
                className="navlink-css"
                to={{pathname:`/particular-blog/${data?._id}`}} state={{ blog_id: data?._id }}
              >
                <div className="list-content">
                  <div className="list-heading">{data?.title}</div>
                  <div className="list-subheading">
                    {data?.blogText.slice(0, 210)}...<span className="read-more-text">Read more</span>
                  </div>
                </div>
              </NavLink>
            </Col>
           
          </Row>
          
        );
      })}
       <NavLink className="navlink-css" to={`/blogs/allblogs/all`}>
               
              
      <div >
       <button  className="More-coupon-guest"  >
          View More
        </button>
      </div>
      </NavLink>
      <br/><br/>
    </Container>
  );
}

export default BlogList;
