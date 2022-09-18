import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import "./MajorCards.css";
import axios from "../../utils/axios";
function MajorCards() {
  const [bannerimage, setBanner] = useState();
  const BannerImage = () => {
    try {
      axios.get(`api/guest/publicimages?type=Home`).then((response) => {
        setBanner(response.data.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    BannerImage();
  }, []);
  return (
    <Container>
      <Row>
        <Carousel prevIcon="" nextIcon="" swipe={true} pause={false}>
         {bannerimage?.map((data,id)=>{
return(
         
          <Carousel.Item interval={4000} key={id}>
            <img
              className="major-img"
              src={data?.image}
              alt="Banners"
              width="100%"
              height="100%"
            />
          </Carousel.Item>
)})}
        </Carousel>
      </Row>
    </Container>
  );
}

export default MajorCards;
