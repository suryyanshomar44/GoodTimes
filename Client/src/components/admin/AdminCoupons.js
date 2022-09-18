import React, { useState, useContext, useEffect } from "react";
import { Container, Button, Form, FormControl } from "react-bootstrap";
import "./AdminCoupons.css";
import Header from "../common/Header";
import AdminSidebar from "../common/AdminSidebar";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import AdminCouponCard from "../admin/AdminCouponCard";
import AdminTrendingCard from "../admin/AdminTrendingCard";
import AdminExpireCard from "../admin/AdminExpireCard";
import axios from "../../utils/axios";
const AdminCoupons = () => {
  const [sidebarShow, setSidebarShow] = useState(false);
  const [more, setMore] = useState();
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);
  const [input, setInput] = useState();
  const [search, setSearch] = useState([]);

  useEffect(() => {
    try {
      axios.get(`api/guest/searchcoupon?coupon=${input}`).then((response) => {
        setSearch(response.data.data);
      });
    } catch (err) {
      console.log(err);
    }
  }, [input]);
  console.log(search);

  if (!isLoading && !user?.isAdmin) navigate("/");
  if (isLoading) return null;

  const More = () => {
    setMore(true);
    if (more === true) {
      setMore(false);
    }
  };
  const ExpireMore = () => {
    setMore(0);
    if (more === 0) {
      setMore(1);
    }
  };

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <AdminSidebar selected={"coupons"} />}
      <Container className="adminv-main">
        <div className="adminv-greet">
          <div className="adminv-head">Hello Admin!</div>
          <div className="adminv-shead">What are you doing today ?</div>
          <div className="serch-head">
            <Button
              variant="primary"
              onClick={() => navigate("/admin/addcoupons")}
              className="btn-New"
            >
              Add New Coupon
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/addstore")}
              className="btn-store"
            >
              Add New store
            </Button>
            <Form
              style={{
                display: "flex",
                justifyContent: "end",
                marginRight: "40px",
                marginBottom: "10px",
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <FormControl
                type="search"
                placeholder="Search-Coupons"
                className="search-input"
                aria-label="Search"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <div
                className="search-icon"
                style={{ display: input ? "none" : "grid" }}
              >
                {" "}
                <IoSearchOutline />
              </div>
            </Form>
          </div>
          {!input ? <div className="Trend-text">Trending Coupons</div> : ""}
        </div>
        <div
          className="adminv-card"
          style={{ display: !input ? "flex" : "none" }}
        >
          <AdminTrendingCard />
        </div>

        {!input ? (
          <div className="Trend-text">Active Coupons</div>
        ) : (
          <div className="Trend-text">Search Coupons</div>
        )}
        <div className="adminv-card">
          <AdminCouponCard more={more} search={search} input={input} />
        </div>
        <button className="More-coupon" onClick={More}>
          More Coupon
        </button>
        <div className="Trend-text">Expired Coupons</div>
        <div className="adminv-card">
          <AdminExpireCard more={more} />
        </div>
        <button className="More-coupon" onClick={ExpireMore}>
          More Coupon
        </button>
      </Container>
    </>
  );
};

export default AdminCoupons;
