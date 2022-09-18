import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import axios from "../../utils/axios";
const BlogCarousel = ({ subcategory, category }) => {
  const [data, setData] = useState();
  const navigate = useNavigate();
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
  let Travel = [
    ...new Map(data?.map((item) => [item["traveltheme"], item])).values(),
  ];
  let subCategory = [
    ...new Map(data?.map((item) => [item["subcategory"], item])).values(),
  ];
  let CheckCat = subCategory.filter(
    (fil) => fil?.category === category[0]?.category
  );

  let changeData =
    subcategory?.slice(0, 11) === "subcategory" ? CheckCat : Travel;
  const sliderSettings = {
    dots: false,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <>
      <Container className="card-main">
        <Row>
          <Slider
            {...sliderSettings}
            style={{ cursor: "pointer", padding: "10px" }}
          >
            {changeData?.map((data) => {
              return (
                <div>
                  <Col
                    className="category-land-card"
                    style={{ cursor: "pointer", padding: "10px" }}
                    onClick={() => {
                      navigate(`/blogs/subcategory=${data?.subcategory}`);
                    }}
                  >
                    <img
                      src={data?.thumbnail}
                      alt="scene1"
                      className="card-img"
                    />
                    <span className="card-category">
                      {subcategory?.slice(0, 11) === "subcategory"
                        ? data?.subcategory
                        : data?.traveltheme}
                    </span>
                  </Col>
                </div>
              );
            })}
          </Slider>
        </Row>
      </Container>
    </>
  );
};

export default BlogCarousel;
