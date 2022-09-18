import React, { useState, useEffect } from "react";
import "./ParticularBlog.css";
import Parser, { attributesToProps } from "html-react-parser";
import Back from "../../assets/images/back.svg";
import Facebook from "../../assets/images/facebook.svg";
import Instagram from "../../assets/images/instagram.svg";
import Twitter from "../../assets/images/twitter.svg";
import Whatsapp from "../../assets/images/whatsapp.svg";
import Share from "../../assets/images/share.svg";
import Views from "../../assets/images/views.svg";
import { Helmet } from "react-helmet";
import Play from "../../assets/images/play.svg";
import Close from "../../assets/images/close.svg";
import { Container, Row, Col } from "react-bootstrap";
import About from "./About";
import Recommend from "./Recommend";
import Navbarr from "../common/Navbarr";
import Footer from "../common/Footer";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comments from "./Comments";
import axios from "../../utils/axios";

function ParticularBlog() {
  const history = useNavigate();
  const location = useLocation();
  let BlogId = useParams();
  let blog_id = BlogId?._id;
  const [state, setState] = useState(false);
  const [play, setPlay] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userdata, setUserData] = useState(null);
  console.log(blog_id);
  function checkLocation() {
    let url = location.pathname.includes("/particular-blog");
    return url;
  }
  console.log(checkLocation());
  let Api = checkLocation()
    ? `api/user/blog/${blog_id}`
    : `api/user/blog/url/${blog_id.toLowerCase()}`;
  const GetBlog = () => {
    try {
      axios.get(Api).then((response) => {
        checkLocation()
          ? setUserData(response?.data.data)
          : setUserData(response?.data.data[0]);
        setLoading(false);
        if (response.data.code !== 200 || response?.data?.data?.length === 0)
          throw history("/");
      });
    } catch (error) {
      const { res } = error;
      console.log(res.code);
    }
  };
  useEffect(() => {
    GetBlog();
  }, []);

  useEffect(() => {
    if (speak) {
      handleSpeak();
    } else {
      window.speechSynthesis.cancel();
    }
  }, [speak]);
  console.log(userdata);
  const handleSpeak = () => {
    const synth = window.speechSynthesis;
    const text = userdata?.blogText;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = synth.getVoices()[6];
    utterThis.onstart = () => {
      setPlay(true);
    };
    utterThis.onend = () => {
      setPlay(false);
      setSpeak(false);
    };
    synth.speak(utterThis);
  };

  const CopyText = async () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(
      <div className="Toast-success-copy">Blog Link Copied To ClipBoard!!</div>,
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
    const data = {
      blogid: blog_id,
    };
    try {
      const res = await axios.post("/api/guest/share_count", data);
      setState(true);
      if (res?.data?.code !== 200) return;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (state === true) {
      GetBlog();
      setState(false);
    }
  }, [state]);
  return (
    <>
      <Navbarr />
      {!loading ? (
        <>
          <Helmet>
            <meta name="description" content={userdata?.metaDescription} />
            <meta name="keywords" content={userdata?.metaKeywords} />
          </Helmet>

          <Container className="pb-main">
            <Row>
              <Col lg={8} style={{ overflow: "hidden" }}>
                <div className="pb-sec1">
                  <div className="pb-left">{userdata?.title}</div>
                  <span className="pb-right">
                    <img
                      src={Back}
                      alt="back"
                      className="pb-back"
                      Title="Go Back"
                      onClick={() => history("/blogs")}
                    />
                  </span>
                </div>

                <div
                  className="pb-sec2"
                  style={{ display: userdata?.status ? "none" : "flex" }}
                >
                  <div className="pb-left">
                    Share via
                    <span>
                      <a
                        onClick={() => CopyText()}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                      >
                        <img src={Facebook} alt="facebook" className="pb-sm" />
                      </a>
                    </span>
                    <span>
                      <a
                        onClick={() => CopyText()}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={` https://www.instagram.com/`}
                      >
                        <img
                          src={Instagram}
                          alt="instagram"
                          className="pb-sm"
                        />
                      </a>
                    </span>
                    <span>
                      <a
                        onClick={() => CopyText()}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`
                    https://twitter.com/share?url=${window.location.href}&text=${userdata?.title}`}
                      >
                        <img src={Twitter} alt="twitter" className="pb-sm" />
                      </a>
                    </span>
                    <span>
                      <a
                        onClick={() => CopyText()}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`
                    https://api.whatsapp.com/send?text=${userdata?.title}    ${window.location.href}
                    `}
                      >
                        <img src={Whatsapp} alt="whatsapp" className="pb-sm" />
                      </a>
                    </span>
                  </div>
                  <div className="pb-right">
                    <span>
                      <img src={Views} alt="views" className="pb-sm" />
                    </span>
                    {userdata?.viewCount}
                    <span>
                      <img
                        src={Share}
                        alt="share"
                        className="pb-sm"
                        onClick={() => CopyText()}
                      />
                    </span>
                    {userdata?.shareCount}
                  </div>
                </div>
                <div className="pb-sec3">
                  <span>Listen to this blog</span>
                  {!play ? (
                    <img
                      src={Play}
                      title="play"
                      alt="play"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSpeak(true)}
                    />
                  ) : (
                    <img
                      src={Close}
                      alt="close"
                      title="stop"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSpeak(false)}
                    />
                  )}
                </div>
                <div className="pb-writing"></div>
                {userdata?.thumbnail.length > 0 ? (
                  <img
                    src={userdata?.thumbnail}
                    alt="blog"
                    className="pb-img"
                  />
                ) : (
                  ""
                )}

                <div className="pb-writing">
                  {!userdata?.content ? "" : Parser(userdata?.content)}
                </div>

                <About
                  BlogId={userdata?._id}
                  Image={userdata?.userId?.profile}
                  Name={
                    userdata?.isGuest === false
                      ? userdata?.userId?.username
                      : userdata?.username
                  }
                  About={
                    userdata?.isGuest === false
                      ? userdata?.userId?.about
                      : userdata?.about
                  }
                  verified={
                    userdata?.isGuest === false
                      ? userdata?.userId?.isverified
                      : false
                  }
                />
                <Comments BlogId={userdata?._id} />
              </Col>
              <Col lg={4}>
                <Recommend
                  category={userdata?.category}
                  subcategory={userdata?.subcategory}
                />
              </Col>
            </Row>
            <ToastContainer />
          </Container>
        </>
      ) : (
        <div>
          <div className="loading-main">
            <div className="loader" />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default ParticularBlog;
