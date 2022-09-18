import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoCloseSharp } from "react-icons/io5";
import { Col, Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import axios from "../../utils/axios";
const TRecommendations = (props) => {
  const [sliderRef, setSliderRef] = useState(null);
  const [getCoupon, setGetCoupon] = useState();
  const [show, setShow] = useState(false);
  const [state, setState] = useState(false);
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
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  let Popular = props.coupons?.filter(
    (store) => store?.isTopRecomendation === true
  );
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
  // console.log(Popular)
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

  useEffect(() => {
    if (state === true) {
      setShow(true);
      show === true ? setShow(false) : setShow(true);
    }
    setState(false);
  }, [state]);

  return (
    <>
      <div className="content">
        <div className="controls">
          <button className="TRbtn" onClick={sliderRef?.slickPrev}>
            <IoIosArrowBack size={20} />
          </button>
        </div>

        <Slider ref={setSliderRef} {...sliderSettings}>
          {Popular?.map((data, id) => {
            return (
              <Col lg={2} key={id}>
                <div
                  className="coupon-cards"
                  style={{ margin: "1em 1em 10px 1em" }}
                >
                  <div className="cccoupon-image">
                    <img
                      src={data?.image}
                      alt={data?.title}
                      className="coupon-card-img"
                    />
                  </div>
                  <div className="coupon-cdh">{data?.title?.slice(0, 55)}</div>
                  <div className="deal-btn">
                    <button
                      className="deal-coupon-btn"
                      onClick={() => handleShow(data?._id)}
                    >
                      Get the deal
                    </button>
                  </div>
                </div>
              </Col>
            );
          })}
        </Slider>
        <div className="controls">
          <button className="TRbtn-right" onClick={sliderRef?.slickNext}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleShow}
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
                  <div className="modal_coupon_code_">{getCoupon?.deal}</div>
                  <div className="Modal-header-inner-border"> CODE</div>
                </div>
              </div>
              <div className="Modal-header-item-1">
                <b>{getCoupon?.title?.slice(0, 55)}</b>
                <IoCloseSharp
                  title="Close"
                  style={{ cursor: "pointer", float: "right" }}
                  onClick={handleShow}
                  size={20}
                />
                <br />
                {getCoupon?.bio?.slice(0, 200)}

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

            <Button variant="success" size="lg" onClick={handleShow}>
              Yes
            </Button>
            <Button variant="danger" size="lg" onClick={handleShow}>
              No
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default TRecommendations;
