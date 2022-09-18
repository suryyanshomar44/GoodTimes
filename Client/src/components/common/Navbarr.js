import React, { useState, useEffect, useContext } from "react";
import "./Navbarr.css";
import Logo from "../../assets/images/logo.jpg";
import Destinations from "../../assets/images/Destinations.jpg";
import Travelimg from "../../assets/images/Travelimg.jpg";
import { Navbar, Container, Nav, Modal, Row, Col } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Close from "../../assets/images/close.svg";
import SignIn from "../../assets/images/signIn.svg";
import SignUp from "../../assets/images/signUp.svg";
import Google from "../../assets/images/google.svg";
import {
  IoMdArrowDropup,
  IoMdArrowDropdown,
  IoIosArrowBack,
} from "react-icons/io";
import User from "../../assets/images/user.svg";
import { signInWithGoogle } from "../../utils/firebaseAuth";
import axios from "../../utils/axios";
import UserContext from "../../utils/userContext";
import { BsSearch } from "react-icons/bs";
function Navbarr() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [signIn, setSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [navdata, setNavdata] = useState([]);
  const [Dropshow, setDropShow] = useState(false);
  const [viewall, setView] = useState(false);
  const [viewInd, setViewind] = useState(true);
  const postSignUpWithGoogle = async (accessToken) => {
    const data = {
      signupType: "gmail",
      firebaseToken: accessToken,
    };

    try {
      const res = await axios.post("api/user/signup", data);
      if (res?.data?.code !== 200) {
        alert(res?.data?.message);
        return;
      }
      navigate("/user/profile");
    } catch (err) {
      console.log(err);
    }
  };

  const postSignInWithGoogle = async (accessToken) => {
    const data = {
      signinType: "gmail",
      firebaseToken: accessToken,
    };

    try {
      const res = await axios.post("api/user/signin", data);
      if (res?.data?.code !== 200) {
        alert(res?.data?.message);
        return;
      }
      setUser(res?.data?.data);
      localStorage.setItem("userid", res?.data?.data._id);
      window.location.reload();
      handleClose();
      navigate("/user/publish")
    } catch (err) {
      console.log(err);
    }
  };

  const postSingupWithEmail = async () => {
    const data = {
      signupType: "email",
      userId: email,
      password: password,
    };
    try {
      const res = await axios.post("api/user/signup", data);
      // console.log(res);
      alert(res?.data?.message);
    } catch (err) {
      console.log(err);
    }
  };

  const postSinginWithEmail = async () => {
    handleClose();
    const data = {
      signinType: "email",
      userId: email,
      password: password,
    };
    try {
      const res = await axios.post("api/user/signin", data);
      // console.log(res);
      if (res?.data?.code !== 200) {
        alert(res?.data?.message);
        return;
      }
      setUser(res?.data?.data);
      localStorage.setItem("userid", res?.data?.data._id);
      window.location.reload();
      handleClose();
      navigate("/user/publish")
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => setShow(false);

  const handleClick = () => {
    setSignIn(!signIn);
  };

  const handleShow = () => {
    setShow(true);
    setSignIn(true);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const resetInputFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    postSingupWithEmail();
    resetInputFields();
  };

  const handleSignin = (e) => {
    e.preventDefault();
    postSinginWithEmail();
    resetInputFields();
  };

  const handleGoogleSignUp = async () => {
    try {
      const accessToken = await signInWithGoogle();
      postSignUpWithGoogle(accessToken);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const accessToken = await signInWithGoogle();
      postSignInWithGoogle(accessToken);
    } catch (err) {
      console.log(err);
    }
  };

  const GetNavD = () => {
    try {
      axios.get(`api/guest/recentblogs`).then((response) => {
        setNavdata(response?.data?.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    GetNavD();
  }, []);

  let IndiaNav, InternationalNav, Travel;
  console.log(IndiaNav, InternationalNav, Travel);

  if (navdata?.length !== 0) {
    let India = navdata?.filter((data) => data?.category === "Technology");
    IndiaNav = [...new Set(India?.flat()?.map((data) => data.subcategory))];
    let International = navdata?.filter((data) => data?.category === "Food");
    InternationalNav = [
      ...new Set(International?.flat()?.map((data) => data.subcategory)),
    ];
  }
  useEffect(() => {
    if (window.location.pathname === "/submit") {
      setShow(true);
    }
  }, [window?.location?.href]);

  // console.log(user);

  return (
    <Navbar
      collapseOnSelect
      className="nav-main"
      expand="lg"
      fixed="top"
      id="navbar"
      style={{
        display: window.location.pathname === "/coupons" ? "none" : "flex",
      }}
    >
      <Container>
        <NavLink className="nav-link nav-padding" to="/">
          <div
            style={{
              position: "relative",
              height: "70px",
              display: "flex",
            }}
          >
            <img src={Logo} alt="logo" height="100%" />
          </div>
        </NavLink>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <NavLink
              className="nav-link nav-padding"
              to="#"
              style={{
                color: Dropshow === false ? "rgba(0,0,0,.55)" : "black",
              }}
              title="show"
              show={Dropshow}
              onClick={() => setDropShow(true)}
            >
              <div>
                Category
                {Dropshow === true ? (
                  <IoMdArrowDropup />
                ) : (
                  <IoMdArrowDropdown />
                )}
              </div>
            </NavLink>

            <NavLink className="nav-link nav-padding" to="/blogs/allblogs">
              All Blogs
            </NavLink>

            {/* <NavLink className="nav-link nav-padding" to="/coupons">
              Coupons
            </NavLink> */}

            {!user ? (
              <NavLink className="nav-link nav-padding" to="/submit">
                Submit Blog
              </NavLink>
            ) : (
              <NavLink className="nav-link nav-padding" to="/user/publish">
                Submit Blog
              </NavLink>
            )}
            {!user && (
              <NavLink
                className="nav-link nav-padding"
                to="/"
                onClick={() => setShow(true)}
              >
                Login
              </NavLink>
            )}
            {/* {!user ? (
              <NavLink
                className="nav-link nav-padding nav-menu"
                onClick={handleShow}
                to={
                  window?.location.href.slice(21) === "/particular-blog"
                    ? "/blog"
                    : "#"
                }
              >
                Sign In
              </NavLink>
            )
             : 
            ( */}
            <NavLink
              style={{ display: user ? "flex" : "none" }}
              className="nav-link nav-padding nav-avatar"
              to={`${user?.isAdmin ? "/admin/dashboard" : "/user/dashboard"}`}
            >
              <img
                src={user?.profile || User}
                alt="user"
                className="nav-aimg"
              />
              {/* <span>
                  {user?.username
                    ? user?.username
                    : user?.isAdmin
                    ? "Admin"
                    : "Username"}
                </span> */}
            </NavLink>
            {/* )} */}
            <NavLink className="nav-link nav-padding" to="/SearchPage">
              <BsSearch />
            </NavLink>
          </Nav>
        </Navbar.Collapse>

        {!user && (
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Body>
              <Container className="nav-cont">
                {signIn === true ? (
                  <Row>
                    <Col lg={6} className="nav-remove">
                      <img src={SignIn} alt="signIn" className="nav-img" />
                    </Col>
                    <Col md={12} lg={6} className="nav-col">
                      <img
                        src={Close}
                        alt="close"
                        onClick={handleClose}
                        className="nav-close"
                      />
                      <div className="nav-signin">
                        <div className="nav-head">Sign In</div>
                        <div className="nav-subhead">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </div>
                        <form className="nav-form" onSubmit={handleSignin}>
                          <input
                            type="email"
                            placeholder="Enter Email id"
                            className="nav-input"
                            onChange={handleEmail}
                            value={email}
                          />
                          <input
                            type="password"
                            placeholder="Enter Password"
                            className="nav-input"
                            onChange={handlePassword}
                            value={password}
                          />
                          <button type="submit" className="nav-sbtn">
                            Sign In
                          </button>
                        </form>
                        <div className="nav-other">
                          Do not have an account ?
                          <span onClick={handleClick}> Sign Up</span>
                        </div>
                        <hr />
                        <div className="nav-gdiv" onClick={handleGoogleSignIn}>
                          <img
                            src={Google}
                            alt="google"
                            className="nav-google"
                          />
                          Sign in with Google
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg={6} className="nav-remove">
                      <img src={SignUp} alt="signUp" className="nav-img" />
                    </Col>
                    <Col md={12} lg={6} className="nav-col">
                      <img
                        src={Close}
                        alt="close"
                        onClick={handleClose}
                        className="nav-close"
                      />
                      <div className="nav-signin">
                        <div className="nav-head">Sign Up</div>
                        <div className="nav-subhead">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </div>
                        <form className="nav-form" onSubmit={handleSignup}>
                          <input
                            type="email"
                            placeholder="Enter Email id"
                            className="nav-input"
                            onChange={handleEmail}
                            value={email}
                          />
                          <input
                            type="password"
                            placeholder="Enter Password"
                            className="nav-input"
                            onChange={handlePassword}
                            value={password}
                          />
                          <button type="submit" className="nav-sbtn">
                            Sign Up
                          </button>
                        </form>
                        <div className="nav-other">
                          Already have an account ?
                          <span onClick={handleClick}> Sign In</span>
                        </div>
                        <hr />
                        <div className="nav-gdiv" onClick={handleGoogleSignUp}>
                          <img
                            src={Google}
                            alt="google"
                            className="nav-google"
                          />
                          Sign Up with Google
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
              </Container>
            </Modal.Body>
          </Modal>
        )}

        <Modal
          show={Dropshow}
          onHide={() => setDropShow(false)}
          className="ModalNavPosition"
        >
          <Modal.Body>
            <div className="Destinations-drop">
              <div className="destinations-main-1">
                <h2>Technology</h2>

                <ul
                  style={{
                    listStyle: "none",
                    columns: 2,
                    webKitColumns: 2,
                    mozColumns: 2,
                    padding: "4px 28px 4px 0px",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  {IndiaNav?.slice(0, 13)
                    ?.sort()
                    ?.map((data, id) => (
                      <li
                        className="destList"
                        key={id}
                        onClick={() => {
                          navigate(`/blogs/subcategory=${data}`);
                          setDropShow(false);
                        }}
                      >
                        {data}
                      </li>
                    ))}
                  <h3
                    className="view-navlist"
                    onClick={() => {
                      setDropShow(false);
                      setView(true);
                      setViewind(true);
                    }}
                  >
                    View All
                  </h3>
                </ul>
              </div>
              <div className="destinations-main-2">
                <h2>Food</h2>

                <ul
                  style={{
                    listStyle: "none",
                    columns: 2,
                    webKitColumns: 2,
                    mozColumns: 2,
                    padding: "4px 28px 4px 0px",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  {InternationalNav?.slice(0, 13)
                    ?.sort()
                    ?.map((data, id) => (
                      <li
                        className="destList"
                        key={id}
                        onClick={() => {
                          navigate(`/blogs/subcategory=${data}`);
                          setDropShow(false);
                        }}
                      >
                        {data}
                      </li>
                    ))}
                  <h3
                    className="view-navlist"
                    onClick={() => {
                      setDropShow(false);
                      setView(true);
                      setViewind(false);
                    }}
                  >
                    View All
                  </h3>
                </ul>
              </div>

              <div className="destinations-main-3">
                <span style={{ borderRadius: "10px" }}>
                  <img
                    style={{ borderRadius: "8px" }}
                    src={Destinations}
                    alt="Destination"
                  ></img>
                </span>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={viewall}
          onHide={() => setView(false)}
          className="ModalNavPosition"
        >
          <Modal.Body>
            <div className="Destinations-drop">
              <div className="destinations-main-1">
                <h2>
                  {" "}
                  <IoIosArrowBack
                    title="Go-Back"
                    onClick={() => {
                      setDropShow(true);
                      setView(false);
                    }}
                    style={{
                      marginLeft: "-20px",
                      marginTop: "-3px",
                      cursor: "pointer",
                    }}
                  />
                  {viewInd ? "Technology" : "Food"}
                </h2>

                <ul
                  style={{
                    listStyle: "none",
                    columns: 2,
                    webKitColumns: 2,
                    mozColumns: 2,
                    padding: "4px 28px 4px 0px",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  {viewInd
                    ? IndiaNav?.sort()?.map((data, id) => (
                        <li
                          className="destList"
                          key={id}
                          onClick={() => {
                            navigate(`/blogs/subcategory=${data}`);
                            setDropShow(false);
                          }}
                        >
                          {data}
                        </li>
                      ))
                    : InternationalNav?.sort()?.map((data, id) => (
                        <li
                          className="destList"
                          key={id}
                          onClick={() => {
                            navigate(`/blogs/subcategory=${data}`);
                            setDropShow(false);
                          }}
                        >
                          {data}
                        </li>
                      ))}
                </ul>
              </div>

              <div className="destinations-main-3">
                <span style={{ borderRadius: "10px" }}>
                  <img
                    style={{ borderRadius: "8px" }}
                    src={Destinations}
                    alt="Destination"
                  ></img>
                </span>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </Navbar>
  );
}

export default Navbarr;
