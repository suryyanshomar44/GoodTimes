import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Col,
  Container,
  Row,
  Modal,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import axios from "../../utils/axios";
import { IoCloseSharp } from "react-icons/io5";

function CCardCountry(props) {
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [getCoupon, setGetCoupon] = useState();
  const [state, setState] = useState(false);
  const [index, setIndex] = useState(0);

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
    if (state === true) {
      setShow(true);
    }
    setState(false);
  }, [state]);

  const GetData = () => {
    let count = { country: props?.country };
    try {
      axios
        .post(
          `/api/guest/couponsviacountry?couponIndex=${index}&isExpired=false`,
          count
        )
        .then((response) => {
          setData([response.data.data]);
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    GetData();
  }, []);
  useEffect(() => {
    setWidth(window.innerWidth);
  });

  const More = () => {
    setIndex(index + 1);
  };

  // console.log(data);
  // console.log(props.country);
  useEffect(() => {
    if (index > 0) {
      let count = { country: props?.country };
      try {
        axios
          .post(
            `/api/guest/couponsviacountry?couponIndex=${index}&isExpired=false`,
            count
          )
          .then((response) => {
            if (response.data.data.length === 0) {
              alert("No More Coupon ");
            } else {
              setData([...data, response.data.data]);
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, [index]);

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
  let Country = data
    ?.flat()
    .filter((data) => data?.country.map((data) => data === props.country));
  // console.log(data.flat().filter((country)=>country?.country===props.country))
  return (
    <Container>
      <Row
        lg={true}
        style={{ display: Country?.length === 0 ? "none" : "flex" }}
      >
        {Country?.flat()?.map((data, id) => {
          return (
            <>
              <Col lg={width > 1200 ? 2 : 6} md={12} key={id}>
                <div className="coupon-cards">
                  <div className="cccoupon-image">
                    <img
                      src={data.image}
                      alt={data.title}
                      className="coupon-card-img"
                    />
                  </div>
                  <div className="coupon-cdh">{data.title.slice(0, 30)}</div>
                  {/* <div className="coupon-cdsh">{data.bio.slice(0, 70)}...</div> */}
                  <div className="deal-btn">
                    <button
                      className="deal-coupon-btn"
                      onClick={() => handleShow(data._id)}
                    >
                      Get the deal
                    </button>
                  </div>
                </div>
              </Col>
            </>
          );
        })}

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
                    <div className="modal_coupon_code_">{getCoupon?.deal}</div>
                    <div className="Modal-header-inner-border"> CODE</div>
                  </div>
                </div>
                <div className="Modal-header-item-1">
                  <b>{getCoupon?.title.slice(0, 55)}</b>
                  <IoCloseSharp
                    title="Close"
                    style={{ cursor: "pointer", float: "right" }}
                    onClick={() => setShow(false)}
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
              <Button variant="danger" size="lg" onClick={() => setShow(false)}>
                No
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </Row>
      <h1
        style={{
          display: Country?.length === 0 ? "flex" : "none",
          justifyContent: "center",
        }}
      >
        Currently No Coupons in {props.country} !!
      </h1>
      <button
        className="More-coupon-guest"
        style={{ display: Country?.length === 0 ? "none" : "block" }}
        onClick={More}
      >
        More Coupon
      </button>
    </Container>
  );
}

export default CCardCountry;
