import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import CCardCountry from "./CCardCountry";

import Footer from "../common/Footer";
import { useNavigate, useLocation} from "react-router-dom";
import axios from "../../utils/axios";
import Header from "./Header";
function CCountry() {
  const [input, setInput] = useState();
  const [Store, setStore] = useState();
  const { state } = useLocation();
  const { data } = state;
  const navigate = useNavigate();

  const GetStore = () => {
    let count = { country: data };
    try {
      axios.post(`/api/guest/couponsviacountry`, count).then((response) => {
        setStore(response.data.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    GetStore();
  }, []);

  const unique = [...new Set(Store?.flat().map((data) => data?.brandName))];

  return (
    <>
     <Header setInput={setInput} text="Search for store and brands" input={input}/>
      <div className="coupon-nav-2">
        <Container>
          <ul className="coupon-nav-2-list mt-2">
            <li
              className="coupon-nav-2-listitem"
              onClick={() => navigate("/coupons/category")}
            >
              Categories
            </li>
            <li
              onClick={() => navigate("/coupons/stores")}
              className="coupon-nav-2-listitem"
            >
              Stores
            </li>
            {/* <li className="coupon-nav-2-listitem-right">Deal of the day</li> */}
          </ul>
        </Container>
      </div>
      <hr />
      <Container className="coupon-main" style={{ marginTop: "4em" }}>
        <br />

        <div className="coupon-heading">
          Selection of{" "}
          <span>the best {new Date().getFullYear()} offers of </span>
          {data}
        </div>

        <Row>
          <CCardCountry country={data} />
        </Row>
        <div className="coupon-heading">
          Popular stores of {data}!! You can
          <span> save money on with Clickonik</span>
        </div>
        <Row>
          {unique.map((Brand, id) => {
            return (
              <>
                <Col lg={2} key={id}>
                  <div
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/brand`, {
                        state: { Brand: Brand },
                      })
                    }
                  >
                    {Brand}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default CCountry;
