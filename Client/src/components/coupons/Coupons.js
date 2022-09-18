import React, { useState, useEffect } from "react";
import "./Coupons.css";
import CouponCard from "../common/CouponCard";
import TRecommendations from "./TRecommendations";
import {Row,Col,Container}from "react-bootstrap"
import Footer from "../common/Footer";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import CouponBanner from "./CouponBanner";
import Header from "./Header";
function Coupons() {
  const [Store, setStore] = useState();
  const navigate = useNavigate();
  const [input, setInput] = useState();
  const [search, setSearch] = useState([]);
  const [allcoupons, setAllCoupons] = useState();
  const [allStores, setAllStores] = useState();
  const GetStore = () => {
    try {
      axios.get(`api/admin/getstores`).then((response) => {
        setStore(response.data.data);
        setAllStores(response.data.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  const GetCoupons = () => {
    try {
      axios.get(`api/guest/getAllCoupons`).then((response) => {
        setAllCoupons(response.data.data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetStore();
    GetCoupons();
  }, []);
  useEffect(() => {
    try {
      axios.get(`api/guest/searchStore?keyword=${input}`).then((response) => {
        setSearch(response.data.data);
      });
    } catch (err) {
      console.log(err);
    }
  }, [input]);
  useEffect(() => {
    if (input?.length > 0) {
      setStore(search);
    } else {
      setStore(allStores);
    }
  }, [search]);

  let Popular = Store?.filter(
    (store) => store?.ispopular === true && store?.coupon?.length !== 0
  );
  const unique = [...new Set(Popular?.flat().map((data) => data.name))];
  var year = new Date().getFullYear();
  const country = [...new Set(allcoupons?.flat().map((data) => data.country))];
  const NewCountry = [...new Set(country?.flat().map((data) => data))];
  // console.log(Store);

  //   const [text] = useState('test');
  //   const [language] = useState('zh-CN');

  //   const [translate, { data, loading }] = useLazyTranslate({
  //     language
  //   })

  //   useEffect(() => {
  //     if (text) {
  //       translate(text, language);
  //     }
  //   }, [translate, text])

  // console.log(text)

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
      <Container className="coupon-mains">
        <div
          className="coupon-banner"
          style={{ display: !input ? "flex" : "none" }}
        >
          <CouponBanner />
        </div>
        {!input ? (
          <div
            className="coupon-heading"
            style={{ padding: "10px 0em 1em 0em" }}
          >
            {/* Top <span>Recommendations </span> */}
            <span>Top Recommendations</span>
          </div>
        ) : (
          <div
            className="coupon-heading"
            style={{ paddingTop: !input ? "2em" : "0em" }}
          >
            Search <span>Stores and Brands </span>
          </div>
        )}

        <Row
          style={{
            display: allcoupons?.length > 0 && !input ? "flex" : "none",
          }}
        >
          <Container>
            <TRecommendations coupons={allcoupons} />
          </Container>
        </Row>

        <div
          className="coupon-heading"
          style={{ display: !input ? "flex" : "none" }}
        >
          Selection of <span> &nbsp;the best {year} offers</span>
        </div>
        <Row style={{ display: !input ? "flex" : "none" }}>
          <CouponCard />
        </Row>
        <div
          className="coupon-heading"
          style={{ display: !input ? "flex" : "none" }}
        >
          Popular stores and brands you can
          <span> &nbsp;save money on with Clickonik</span>
        </div>
        <Row lg={true}>
          {unique?.slice(0, 30)?.map((Brand, id) => {
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
        <Row
          lg={true}
          style={{
            display: search?.flat()?.length === 0 && input ? "flex" : "none",
            textAlign: "center",
            color: "red",
            textDecoration: "underline",
          }}
        >
          <h1>Currently No Stores to Display !!</h1>
        </Row>
        <button
          className="More-coupon-guest"
          onClick={() => navigate("/coupons/stores")}
          style={{
            display: search?.flat()?.length > 0 ? "" : "none",
          }}
        >
          {Store?.length - unique?.length} More Stores {`>>`}
        </button>
        <div
          className="coupon-heading"
          style={{ display: allcoupons?.length > 0 && !input ? "" : "none" }}
        >
          <span>Clickonik</span> helps people buy stuff cheaper
          <span> in {NewCountry?.length} countries</span> around the world!
        </div>
        <Row
          style={{
            display: allcoupons?.length > 0 && !input ? "flex" : "none",
          }}
        >
          {NewCountry?.sort()?.map((data) => {
            return (
              <Col md={6} lg={2}>
                <div
                  className="coupon-flag"
                  title={`Go to ${data} Coupons`}
                  onClick={() =>
                    navigate(`/coupons/${data}`, {
                      state: { data: data },
                    })
                  }
                >
                  <img
                    className="coupon-flag-img"
                    src={`https://countryflagsapi.com/svg/${data}`}
                    alt="flag"
                  />
                  <span>{data}</span>
                </div>
              </Col>
            );
          })}
        </Row>
        <br />
      </Container>
      <Footer />
    </>
  );
}

export default Coupons;
