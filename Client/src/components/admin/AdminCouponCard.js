import React, { useState, useEffect } from "react";
import "./AdminCoupons.css";
import { Col, Row, Container } from "react-bootstrap";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
const AdminCouponCard = (props) => {
  const [data, setData] = useState();
  const[alldata,setAlldata] = useState();
  const [width, setWidth] = useState(window.innerWidth);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const GetData = () => {
    try {
      axios
        .get(`api/admin/coupon?couponIndex=${index}&isExpired=false`)
        .then((response) => {
          setData([response.data.data]);
          setAlldata([response.data.data]);
        });
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    if (props?.more === true || props?.more=== false) {
      setIndex(index + 1);

      try {
        axios
          .get(`api/admin/coupon?couponIndex=${index + 1}&isExpired=false`)
          .then((response) => {
            if (response.data.data.length === 0) {
              alert("No more Active Coupon ");
            } else {
              setData([...data, response.data.data]);
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, [props.more]);

  //
  useEffect(() => {
    GetData();
  }, []);

  useEffect(() => {
    setWidth(window.innerWidth);
  });

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
          .get(`api/admin/coupon?couponIndex=${index}&isExpired=false`)
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
    if (props.input){
      setData([props.search]);
    }
    else{
      setData(alldata);
    }
    
    
    },[props.search])

  


    // console.log(data)
    // console.log(props.trend)


  return (
    <Container>
      <Row lg={true}>
        {data?.flat()?.map((data, id) => {
          let ms = data?.to - data?.from;
          let day = ms / 86400000;
          let coupon = data;
          return (
            <>
              <Col lg={width > 1200 ? 4 : 6} md={12} key={id}>
                <div className="cc-cards">
                  <div className="ccoupon-image">
                    <img
                      src={data?.image}
                      alt={data?.title}
                      className="card-coupon-img"
                    />
                  </div>
                  <div className="cc-cdh">{data?.title?.slice(0, 55)}</div>
                  <div className="cc-cdsh">{data?.bio?.slice(0, 70)}...</div>
                  <div className="web-font">
                    <a
                      href={data?.websiteLink}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-visit"
                    >
                      Visit Website
                    </a>
                    <p className="text-days">{day} Days Left</p>
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
                    <button
                      className="delete-btn"
                      onClick={() => Delete(coupon)}
                    >
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

export default AdminCouponCard;
