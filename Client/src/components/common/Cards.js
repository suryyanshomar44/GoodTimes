import React, { useState, useEffect } from "react";
import "./Cards.css";
import { Container, Row, Col } from "react-bootstrap";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
function Cards() {
  const [data, setData]=useState();
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
  let Travel = [...new Map(data?.map(item =>
    [item['subcategory'], item])).values()];        
 
  return (
    <Container className="card-main">
      <Row >
        {Travel?.map((data)=>{
          return(
        <Col lg={3} className="category-land-card" style={{cursor: "pointer"}} onClick={() => {
          navigate(`/blogs/subcategory=${data?.subcategory}`);
        }}>
          <img src={data?.thumbnail} alt="scene1" className="card-img" />
          <span className="card-category">{data?.subcategory}</span>
        </Col>
        
         ) })}
         
      </Row>
     

     
        
        
    
 
    

    </Container>
  );
}

export default Cards;
