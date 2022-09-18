import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CouponCard from "../common/CouponCard";
import {
  Col,
  Container,
  Row,
  Modal,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Footer from "../common/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import axios from "../../utils/axios";
import Header from "./Header";
function SingleCategory() {
  const [data, setData] = useState();
  const [getCoupon, setGetCoupon] = useState();
  const [show, setShow] = useState(false);
  const [updatestate, setState] = useState(false);
  const { state } = useLocation();
  const [input, setInput] = useState();
  const { Category } = state;
  const navigate = useNavigate();
  const GetData = () => {
    try {
      axios
        .post(`api/guest/couponsfiltered?category=${Category}`)
        .then((response) => {
          setData(response.data.data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetData();
  }, []);
  const CopyText = (e) => {
    navigator.clipboard.writeText(e);
    toast.success(
      <div className="Toast-success-copy">Coupon Copied To ClipBoard!!</div>,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const handleShow = (e) => {
    try {
      axios.get(`api/user/coupon/${e}`).then((response) => {
        setGetCoupon(response.data.data);
      });
    } catch (err) {
      console.log(err);
    }
    setState(true);
  };

  useEffect(() => {
    if (updatestate === true) {
      setShow(true);
      show === true ? setShow(false) : setShow(true);
    }
    setState(false);
  }, [updatestate]);
  let Newdata = data
    ?.flat()
    ?.map((data) => data?.coupon?.flat()?.map((data) => data));
  const country = [...new Set(Newdata?.flat().map((data) => data.country))];
  const Newcountry = [...new Set(country?.flat().map((data) => data))];
  var year = new Date().getFullYear();
  var month = new Date().getMonth();
  const AllMonth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const uniqueB = [...new Set(Newdata?.flat().map((data) => data.brandName))];
  return (
    <>
      <Header
        setInput={setInput}
        text="Search for store and brands"
        input={input}
      />
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

      <Container className="Brand-main">
        <Row>
          <Col lg={4}>
            <div className="brand-left-1-cards"> {uniqueB.join(", ")}</div>

            <div className="brand-left-3-cards">
              Check out offers in other countries
              <div className="brand-left-3-flag">
                <Row className="mt-4">
                  {Newcountry?.flat()?.map((data) => {
                    return (
                      <Col>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/coupons/${data}`, {
                              state: { data: data },
                            })
                          }
                        >
                          <img
                            className="coupon-flag-img"
                            style={{ width: "50px" }}
                            src={`https://countryflagsapi.com/svg/${data}`}
                            alt="flag"
                          />
                          <span
                            className="brand-flag-coupon"
                            style={{ fontSize: "13px", whiteSpace: "nowrap" }}
                          >
                            {" "}
                            {data}
                          </span>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </div>
          </Col>

          <Col lg={8}>
            <h2 className="brand-right-1-cards">
              <b>
                {uniqueB.join(", ")} discount offers and discount codes &nbsp;{" "}
                {AllMonth[month]} {year}
              </b>
              <br />
              Find the latest {Category} discount codes and discount coupons
              here. Buy for less!
            </h2>
            {Newdata?.flat()?.map((data, id) => {
              return (
                <>
                  <div className="brand-right-2-cards" key={id}>
                    <div className="brand-right-2-header-grid">
                      <div className="brand-right-2-header-item-0">
                        <div className="brand-right-2-header-box">
                          <div className="brand-right-2_coupon_code_">
                            {data?.deal?.slice(0, 3)}
                          </div>
                          <div className="brand-right-2-header-inner-border">
                            CODE
                          </div>
                        </div>
                      </div>
                      <div className="brand-right-2-header-item-1">
                        <b>{data?.title?.slice(0, 55)}</b>
                        <br />
                        <p className="brand-right-2-para">
                          {data?.bio?.slice(0, 200)}
                        </p>
                      </div>

                      <div className="brand-deal-btn">
                        <button
                          className="brand-deal-coupon-btn"
                          onClick={() => handleShow(data._id)}
                        >
                          Get the deal
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </Col>
          <Modal
            show={show}
            onHide={() => setShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal_body"
            dialogClassName="modal-90w"
          >
            <Modal.Header>
              <Modal.Title>
                <div className="Modal-header-grid">
                  <div className="Modal-header-item-0">
                    <div className="Modal-header-box">
                      <div className="modal_coupon_code_">
                        {getCoupon?.deal.slice(0, 3)}
                      </div>
                      <div className="Modal-header-inner-border"> CODE</div>
                    </div>
                  </div>
                  <div className="Modal-header-item-1">
                    <b>{getCoupon?.title.slice(0, 55)}</b>
                    <IoCloseSharp
                      title="Close"
                      style={{ cursor: "pointer", float: "right" }}
                      onClick={handleShow}
                      size={20}
                    />
                    <br />
                    {getCoupon?.bio.slice(0, 200)}

                    <br />
                    <div className="verify-modal">Verified</div>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="Modal-Body-main">
                <div className="Modal-Body-goto">
                  Go to{" "}
                  <a
                    href={getCoupon?.websiteLink}
                    style={{ textDecoration: "none" }}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {getCoupon?.brandName}&nbsp;
                  </a>
                  and paste the code at checkout
                </div>
                <div className="Modal-Body-Form-control">
                  <InputGroup className="Modal-Body-input">
                    <FormControl
                      className="Modal-Body-form"
                      value={getCoupon?.couponCode}
                      style={{ fontWeight: "bold", fontSize: "14px" }}
                    />
                    <Button
                      size="lg"
                      variant="dark"
                      className="modal-body-copy"
                      onClick={() => CopyText(getCoupon?.couponCode)}
                      style={{ boxShadow: "none", width: "80px" }}
                    >
                      COPY
                    </Button>
                    <ToastContainer />
                  </InputGroup>
                </div>
                <div className="Modal-Body-save">
                  <button className="Modal-Body-Website">
                    <a
                      href={getCoupon?.websiteLink}
                      style={{ textDecoration: "none", color: "white" }}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {" "}
                      Go to {getCoupon?.brandName} Website
                    </a>
                  </button>
                </div>
              </div>
            </Modal.Body>
            <div className="modal-footer-main">
              <Modal.Footer>
                <h4>Use the code and let us know if it works</h4>

                <Button
                  variant="success"
                  size="lg"
                  onClick={() => setShow(false)}
                >
                  Yes
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => setShow(false)}
                >
                  No
                </Button>
              </Modal.Footer>
            </div>
          </Modal>
        </Row>
        <Row>
          <div className="Row2-brand-similarcard">
            <div className="similarpromo-card-brand">
              Similar <a style={{ color: "#ff9900" }}>Promo Codes</a>
            </div>

            <CouponCard />
          </div>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default SingleCategory;
