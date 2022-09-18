import React, { useState, useEffect } from "react";
import "./AdminCoupons.css";
import { Col, Row, Container } from "react-bootstrap";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const AdminExpireCard = (more) => {
  const [data, setData] = useState();
  const [width, setWidth] = useState(window.innerWidth);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const GetData = () => {
    try {
      axios
        .get(`api/admin/coupon?couponIndex=${index}&isExpired=true`)
        .then((response) => {
          setData(response.data.data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (more.more === 0 || more.more === 1) {
      setIndex(index + 1);
      try {
        axios
          .get(`api/admin/coupon?couponIndex=${index+1}&isExpired=true`)
          .then((response) => {
            if (response.data.data.length === 0) {
              alert("No More Expired Coupon ");
            } else {
              setData([...data, response.data.data]);
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, [more]);

  useEffect(() => {
    GetData();
  }, []);

  const Delete = async (coupon) => {
 
    try {
      const res = await axios.delete(`api/admin/coupon/${coupon._id}`);
      alert(res?.data?.message);
    } catch (err) {
      console.log(err);
    }
    function Delete() {
      setData(data.flat().filter((data) => coupon !== data));
      try {
        axios
          .get(`api/admin/coupon?couponIndex=${index}&isExpired=true`)
          .then((response) => {
            setData([response.data.data]);
          });
      } catch (err) {
        console.log(err);
      }
    }
    Delete();

    
  };

  useEffect(() => {
    setWidth(window.innerWidth);
  });


  return (
    <Container>
      <Row lg={3}>
      {data?.flat()?.map((data, id) => {
          let coupon = data;
          return (
            <>
              <Col lg={width > 1200 ? 4 : 6} md={12} key={id}>
                <div className="cc-expire-cards">
                  <div className="ccoupon-image">
                    <img
                      src={data.image}
                      alt={data.title}
                      className="card-coupon-img"
                    />
                  </div>
                  <div className="cc-cdh">{data.title.slice(0, 55)}</div>
                  <div className="cc-cdsh">{data.bio.slice(0, 70)}...</div>
                  <div className="web-font">
                    <a
                      href={data.websiteLink}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-visit"
                    >
                      Visit Website
                    </a>
                    <p className="text-expire-days">0 Days Left</p>
                  </div>
                  <div className="btn-edit-delete">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/admin/editcoupons`, {
                          state: { coupon: coupon },
                        })
                      }
                    >
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => Delete(coupon)}>
                      delete
                    </button>
                  </div>
                </div>
              </Col>
            </>
          );
        })}
      </Row>
    </Container>
  );
};

export default AdminExpireCard;
