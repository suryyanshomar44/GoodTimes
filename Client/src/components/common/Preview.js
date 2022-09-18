import React, { useState, useEffect } from "react";
import "./Preview.css";
import Back from "../../assets/images/back.svg";
import Facebook from "../../assets/images/facebook.svg";
import Instagram from "../../assets/images/instagram.svg";
import Twitter from "../../assets/images/twitter.svg";
import Whatsapp from "../../assets/images/whatsapp.svg";
import Share from "../../assets/images/share.svg";
import Views from "../../assets/images/views.svg";
import Play from "../../assets/images/play.svg";
import Close from "../../assets/images/close.svg";
import { Container, Row, Col } from "react-bootstrap";
import HTMLReactParser from "html-react-parser";

function Preview({ title, blog, blogText }) {
  const [play, setPlay] = useState(false);
  const [speak, setSpeak] = useState(false);

  useEffect(() => {
    const handleSpeak = () => {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(blogText);
      utterThis.voice = synth.getVoices()[6];
      utterThis.onstart = () => {
        // console.log("utter start");
        setPlay(true);
      };
      utterThis.onend = () => {
        // console.log("utter end");
        setPlay(false);
        setSpeak(false);
      };
      synth.speak(utterThis);
    };
    if (speak) {
      handleSpeak();
    } else {
      window.speechSynthesis.cancel();
    }
  }, [speak, blogText]);

  return (
    <Container className="pre-main">
      <Row>
        <Col lg={8}>
          <div className="pre-sec1">
            <span>
              <img src={Back} alt="back" className="pre-back" />
            </span>
            {title}
          </div>
          <div className="pre-sec2">
            <div className="pre-left">
              Share via
              <span>
                <img src={Facebook} alt="facebook" className="pre-sm" />
              </span>
              <span>
                <img src={Instagram} alt="instagram" className="pre-sm" />
              </span>
              <span>
                <img src={Twitter} alt="twitter" className="pre-sm" />
              </span>
              <span>
                <img src={Whatsapp} alt="whatsapp" className="pre-sm" />
              </span>
            </div>
            <div className="pre-right">
              <span>
                <img src={Views} alt="views" className="pre-sm" />
              </span>
              102
              <span>
                <img src={Share} alt="share" className="pre-sm" />
              </span>
              14
            </div>
          </div>
          <div className="pre-sec3">
            <span>Listen to this blog</span>
            {!play ? (
              <img src={Play} alt="play" onClick={() => setSpeak(true)} />
            ) : (
              <img src={Close} alt="close" onClick={() => setSpeak(false)} />
            )}
          </div>
          <div className="pre-body">{HTMLReactParser(blog)}</div>
        </Col>
        <Col lg={4}></Col>
      </Row>
    </Container>
  );
}

export default Preview;
