import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Navbarr from "../common/Navbarr";
import Footer from "../common/Footer";
import BlogCarousel from "./BlogCarousel";
function Blogbycategory() {
  const [data, setData] = useState();
  const[passCat,setCat]= useState();
  let { category } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    function GetData() {
      try {
        axios.get(`api/user/blog/filtered?${category}`).then((response) => {
          setData(response.data.data);
         setCat(response.data.data[0]?.category)
          if (response.data.data?.length === 0) {
            navigate("/");
          }
        });
      } catch (err) {
        console.log(err);
      }
    }

    GetData();
  }, []);

  useEffect(() => {
    function GetData() {
      try {
        axios.get(`api/user/blog/filtered?${category}`).then((response) => {
          setData(response.data.data);
          setCat(response.data.data[0].category)
          if (response.data.data?.length === 0) {
            navigate("/");
          }
        });
      } catch (err) {
        console.log(err);
      }
    }

    GetData();
  }, [category]);
  let newtheme = category.replace("traveltheme=", "");
  let newsubcat = category.replace("subcategory=", "");
  return (
    <>
      <Navbarr />
      <div className="blogs-main">
        <BlogCarousel subcategory={category} category={data}/>
        <Container className="list-main">
          <div className="list-explore">
            <span>
              {category.slice(0, 11) === "subcategory" ? newsubcat : newtheme}
            </span>{" "}
            Blogs
          </div>
          {data
            ?.slice(-10)
            ?.reverse()
            ?.map((data, id) => {
              return (
                <Row className="list-row" key={id}>
                  <Col lg={2} xs={3} md={3}>
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
                      to={{ pathname: `/particular-blog/${data?._id}` }}
                      state={{ blog_id: data?._id }}
                    >
                      <div className="list-content">
                        <div className="list-heading">{data?.title}</div>
                        <div className="list-subheading">
                          {data?.blogText.slice(0, 210)}...
                          <span className="read-more-text">Read more</span>
                        </div>
                      </div>
                    </NavLink>
                  </Col>
                </Row>
              );
            })}
          {category.slice(0, 11) === "subcategory"?<NavLink className="navlink-css" to={`/blogs/allblogs/${passCat}`}>
            <div>
              <button className="More-coupon-guest">View More</button>
            </div>
          </NavLink>:<NavLink className="navlink-css" to={`/blogs/allblogs/${newtheme}`}>
            <div>
              <button className="More-coupon-guest">View More</button>
            </div>
          </NavLink>}
        </Container>

        <br />
        <br />
      </div>
      <Footer />
    </>
  );
}

export default Blogbycategory;
