import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Header from "./Header"
import Footer from "../common/Footer";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
function AllCategory() {
  const navigate = useNavigate();
  const [Store, setStore] = useState();
  const [filterword, setWord] = useState("all");
  const [input, setInput] = useState();
  const [state, setState] = useState(false);
  const [unique, setUnique] = useState([]);
  const [alphabet, setAlphabet] = useState({
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    F: "",
    G: "",
    H: "",
    I: "",
    J: "",
    K: "",
    L: "",
    M: "",
    N: "",
    O: "",
    P: "",
    Q: "",
    R: "",
    S: "",
    T: "",
    U: "",
    V: "",
    W: "",
    X: "",
    Y: "",
    Z: "",
  });

  const GetStore = () => {
    try {
      axios.get(`api/admin/getstores`).then((response) => {
        setStore(response.data.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    GetStore();
  }, []);
  useEffect(() => {
    if (state) {
      GetStore();
    }
    setState(false);
  }, [state]);
  useEffect(() => {
    if (Store?.length > 0) {
      let CheckStore = Store?.filter((data) => data?.coupon?.length > 0);
      const Checkunique = [
        ...new Set(CheckStore?.flat().map((data) => data.category)),
      ];
      setUnique([...new Set(Checkunique?.flat().map((data) => data))]);
    }
  }, [Store]);

  useEffect(() => {
    unique.filter((val) => {
      if (input?.length === 0) {
        setState(true);
      } else if (val?.toLowerCase()?.includes(input?.toLowerCase())) {
        setUnique([val]);
      } else {
       return null
      }
    });
  }, [input]);


  useEffect(() => {
    if (unique?.length > 0) {
      setAlphabet({
        A: unique.filter((data) => data?.toLowerCase().indexOf("a") === 0),
        B: unique.filter((data) => data?.toLowerCase().indexOf("b") === 0),
        C: unique.filter((data) => data?.toLowerCase().indexOf("c") === 0),
        D: unique.filter((data) => data?.toLowerCase().indexOf("d") === 0),
        E: unique.filter((data) => data?.toLowerCase().indexOf("e") === 0),
        F: unique.filter((data) => data?.toLowerCase().indexOf("f") === 0),
        G: unique.filter((data) => data?.toLowerCase().indexOf("g") === 0),
        H: unique.filter((data) => data?.toLowerCase().indexOf("h") === 0),
        I: unique.filter((data) => data?.toLowerCase().indexOf("i") === 0),
        J: unique.filter((data) => data?.toLowerCase().indexOf("j") === 0),
        K: unique.filter((data) => data?.toLowerCase().indexOf("k") === 0),
        L: unique.filter((data) => data?.toLowerCase().indexOf("l") === 0),
        M: unique.filter((data) => data?.toLowerCase().indexOf("m") === 0),
        N: unique.filter((data) => data?.toLowerCase().indexOf("n") === 0),
        O: unique.filter((data) => data?.toLowerCase().indexOf("o") === 0),
        P: unique.filter((data) => data?.toLowerCase().indexOf("p") === 0),
        Q: unique.filter((data) => data?.toLowerCase().indexOf("q") === 0),
        R: unique.filter((data) => data?.toLowerCase().indexOf("r") === 0),
        S: unique.filter((data) => data?.toLowerCase().indexOf("s") === 0),
        T: unique.filter((data) => data?.toLowerCase().indexOf("t") === 0),
        U: unique.filter((data) => data?.toLowerCase().indexOf("u") === 0),
        V: unique.filter((data) => data?.toLowerCase().indexOf("v") === 0),
        W: unique.filter((data) => data?.toLowerCase().indexOf("w") === 0),
        X: unique.filter((data) => data?.toLowerCase().indexOf("x") === 0),
        Y: unique.filter((data) => data?.toLowerCase().indexOf("y") === 0),
        Z: unique.filter((data) => data?.toLowerCase().indexOf("z") === 0),
      });
    }
  }, [unique]);

  let A = [alphabet.A];
  let B = [alphabet.B];
  let C = [alphabet.C];
  let D = [alphabet.D];
  let E = [alphabet.E];
  let F = [alphabet.F];
  let G = [alphabet.G];
  let H = [alphabet.H];
  let I = [alphabet.I];
  let J = [alphabet.J];
  let K = [alphabet.K];
  let L = [alphabet.L];
  let M = [alphabet.M];
  let N = [alphabet.N];
  let O = [alphabet.O];
  let P = [alphabet.P];
  let Q = [alphabet.Q];
  let R = [alphabet.R];
  let S = [alphabet.S];
  let T = [alphabet.T];
  let U = [alphabet.U];
  let V = [alphabet.V];
  let W = [alphabet.W];
  let X = [alphabet.X];
  let Y = [alphabet.Y];
  let Z = [alphabet.Z];

  const browsevalue = (e) => {
    setWord(e.target.innerText?.toLowerCase());
  };

  useEffect(() => {
    if (
      filterword === "all" ||
      filterword === "allabcdefghijklmnopqrstuvwxyz"
    ) {
      setAlphabet({
        A: unique.filter((data) => data?.toLowerCase().indexOf("a") === 0),
        B: unique.filter((data) => data?.toLowerCase().indexOf("b") === 0),
        C: unique.filter((data) => data?.toLowerCase().indexOf("c") === 0),
        D: unique.filter((data) => data?.toLowerCase().indexOf("d") === 0),
        E: unique.filter((data) => data?.toLowerCase().indexOf("e") === 0),
        F: unique.filter((data) => data?.toLowerCase().indexOf("f") === 0),
        G: unique.filter((data) => data?.toLowerCase().indexOf("g") === 0),
        H: unique.filter((data) => data?.toLowerCase().indexOf("h") === 0),
        I: unique.filter((data) => data?.toLowerCase().indexOf("i") === 0),
        J: unique.filter((data) => data?.toLowerCase().indexOf("j") === 0),
        K: unique.filter((data) => data?.toLowerCase().indexOf("k") === 0),
        L: unique.filter((data) => data?.toLowerCase().indexOf("l") === 0),
        M: unique.filter((data) => data?.toLowerCase().indexOf("m") === 0),
        N: unique.filter((data) => data?.toLowerCase().indexOf("n") === 0),
        O: unique.filter((data) => data?.toLowerCase().indexOf("o") === 0),
        P: unique.filter((data) => data?.toLowerCase().indexOf("p") === 0),
        Q: unique.filter((data) => data?.toLowerCase().indexOf("q") === 0),
        R: unique.filter((data) => data?.toLowerCase().indexOf("r") === 0),
        S: unique.filter((data) => data?.toLowerCase().indexOf("s") === 0),
        T: unique.filter((data) => data?.toLowerCase().indexOf("t") === 0),
        U: unique.filter((data) => data?.toLowerCase().indexOf("u") === 0),
        V: unique.filter((data) => data?.toLowerCase().indexOf("v") === 0),
        W: unique.filter((data) => data?.toLowerCase().indexOf("w") === 0),
        X: unique.filter((data) => data?.toLowerCase().indexOf("x") === 0),
        Y: unique.filter((data) => data?.toLowerCase().indexOf("y") === 0),
        Z: unique.filter((data) => data?.toLowerCase().indexOf("z") === 0),
      });
    } else {
      let filterunique = unique.filter(
        (data) => data?.toLowerCase().indexOf(filterword) === 0
      );
      setAlphabet({
        A: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("a") === 0
        ),
        B: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("b") === 0
        ),
        C: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("c") === 0
        ),
        D: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("d") === 0
        ),
        E: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("e") === 0
        ),
        F: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("f") === 0
        ),
        G: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("g") === 0
        ),
        H: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("h") === 0
        ),
        I: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("i") === 0
        ),
        J: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("j") === 0
        ),
        K: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("k") === 0
        ),
        L: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("l") === 0
        ),
        M: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("m") === 0
        ),
        N: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("n") === 0
        ),
        O: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("o") === 0
        ),
        P: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("p") === 0
        ),
        Q: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("q") === 0
        ),
        R: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("r") === 0
        ),
        S: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("s") === 0
        ),
        T: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("t") === 0
        ),
        U: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("u") === 0
        ),
        V: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("v") === 0
        ),
        W: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("w") === 0
        ),
        X: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("x") === 0
        ),
        Y: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("y") === 0
        ),
        Z: filterunique.filter(
          (data) => data?.toLowerCase().indexOf("z") === 0
        ),
      });
    }
  }, [filterword]);

  return (
    <>
    <Header setInput={setInput} text="Search Categories" input={input}/>
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
          </ul>
        </Container>
      </div>
      <hr />

      <Container className="allbrand-main">
        <div className="coupon-heading ">
          Popular Categories you can
          <span> save money on with Clickonik</span>
        </div>
        <div className="browse-store">
          Browse all Categories
          <div className="browse-store-character" onClick={browsevalue}>
            <span
              className={
                filterword === "all" ||
                filterword === "allabcdefghijklmnopqrstuvwxyz"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              All
            </span>
            <span
              className={
                filterword === "a"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              A
            </span>
            <span
              className={
                filterword === "b"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              B
            </span>
            <span
              className={
                filterword === "c"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              C
            </span>
            <span
              className={
                filterword === "d"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              D
            </span>
            <span
              className={
                filterword === "e"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              E
            </span>
            <span
              className={
                filterword === "f"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              F
            </span>
            <span
              className={
                filterword === "g"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              G
            </span>
            <span
              className={
                filterword === "h"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              H
            </span>
            <span
              className={
                filterword === "i"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              I
            </span>
            <span
              className={
                filterword === "j"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              J
            </span>
            <span
              className={
                filterword === "k"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              K
            </span>
            <span
              className={
                filterword === "l"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              L
            </span>
            <span
              className={
                filterword === "m"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              M
            </span>
            <span
              className={
                filterword === "n"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              N
            </span>
            <span
              className={
                filterword === "o"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              O
            </span>
            <span
              className={
                filterword === "p"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              P
            </span>
            <span
              className={
                filterword === "q"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              Q
            </span>
            <span
              className={
                filterword === "r"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              R
            </span>
            <span
              className={
                filterword === "s"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              S
            </span>
            <span
              className={
                filterword === "t"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              T
            </span>
            <span
              className={
                filterword === "u"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              U
            </span>
            <span
              className={
                filterword === "v"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              V
            </span>
            <span
              className={
                filterword === "w"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              W
            </span>
            <span
              className={
                filterword === "x"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              X
            </span>
            <span
              className={
                filterword === "y"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              Y
            </span>
            <span
              className={
                filterword === "z"
                  ? "browse-store-alpahabet-active"
                  : "browse-store-alpahabet"
              }
            >
              Z
            </span>
          </div>
        </div>
        <Row
          style={{
            display:
              !alphabet?.A || alphabet?.A?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; A</h2>
          {A?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.B || alphabet?.B?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; B</h2>
          {B?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.C || alphabet?.C?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; C</h2>
          {C?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.D || alphabet?.D?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; D</h2>
          {D?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.E || alphabet?.E?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; E</h2>
          {E?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.F || alphabet?.F?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; F</h2>
          {F?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.G || alphabet?.G?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; G</h2>
          {G?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.H || alphabet?.H?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; H</h2>
          {H?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.I || alphabet?.I?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; I</h2>
          {I?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.J || alphabet?.J?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; J</h2>
          {J?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.K || alphabet?.K?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; K</h2>
          {K?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.L || alphabet?.L?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; L</h2>
          {L?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.M || alphabet?.M?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; M</h2>
          {M?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.N || alphabet?.N?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; N</h2>
          {N?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.O || alphabet?.O?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; O</h2>
          {O?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.P || alphabet?.P?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; P</h2>
          {P?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.Q || alphabet?.Q?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; Q</h2>
          {Q?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.R || alphabet?.R?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; R</h2>
          {R?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.S || alphabet?.S?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; S</h2>
          {S?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.T || alphabet?.T?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; T</h2>
          {T?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.U || alphabet?.U?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; U</h2>
          {U?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.V || alphabet?.V?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; V</h2>
          {V?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.W || alphabet?.W?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; W</h2>
          {W?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.X || alphabet?.X?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; X</h2>
          {X?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.Y || alphabet?.Y?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; Y</h2>
          {Y?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
                  </div>
                </Col>
              </>
            );
          })}
        </Row>

        <Row
          style={{
            display:
              !alphabet?.Z || alphabet?.Z?.length === 0 ? "none" : "flex",
          }}
        >
          <h2> &nbsp; Z</h2>
          {Z?.flat()?.map((Category, id) => {
            return (
              <>
                <Col lg={2} md={3} xs={4} key={id}>
                  <div
                    style={{ fontSize: "16px" }}
                    className="coupon-brand"
                    onClick={() =>
                      navigate(`/coupons/singlecategory`, {
                        state: { Category: Category },
                      })
                    }
                  >
                    {Category}
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

export default AllCategory;
