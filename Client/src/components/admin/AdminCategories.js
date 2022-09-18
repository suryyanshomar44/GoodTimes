import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import "./AdminCategories.css";
import { BsFillCheckSquareFill, BsFillSquareFill } from "react-icons/bs";

import Header from "../common/Header";
import AdminSidebar from "../common/AdminSidebar";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import axios from "../../utils/axios";

const AdminCategories = () => {
  const navigate = useNavigate();
  const [isTravel, setIsTravel] = useState(false);
  const [sidebarShow, setSidebarShow] = useState(false);
  const { user, isLoading } = useContext(UserContext);
  const [state, setState] = useState(true);
  const [post, setPost] = useState(false);
  const [color, setColor] = useState();
  const [show, setShow] = useState(false);
  const [showsub, setShowsub] = useState(false);
  const [list, setList] = useState([]);
  const [input, setInput] = useState("");
  const [inputsub, setInputsub] = useState("");
  const [remove, setRemove] = useState();
  const [subc, setSub] = useState([]);
  const [subarray, setSubarray] = useState([]);
  const [Modalshow, setModalShow] = useState(false);
  const [removesub, setRemovesub] = useState("");
  const [subpostC, setSubpostC] = useState(false);
  const [travelshow, setTravelShow] = useState(false);
  const [removet, setRemoveT] = useState();
  const [inputtravel, setInputTravel] = useState("");
 
  const [travelmap, setTravelmap] = useState([]);
  const [Tpost, setTPost] = useState(false);
  useEffect(() => {
    function Getcategory() {
      try {
        axios
          .get(`api/admin/blogCategory?istravel=${isTravel}`)
          .then((response) => {
            let newdata = response?.data?.data;
            setList(newdata.map((data) => data.category));
            setSub(response.data.data);
            // setAlldata(response.data.data);
          });
      } catch (err) {
        console.log(err);
      }
    }
    Getcategory();
  }, []);
  const ShowEdit = () => {
    setColor();
    if (show === true) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const ShowSubEdit = () => {
    setColor();
    if (showsub === true) {
      setShowsub(false);
    } else {
      setShowsub(true);
    }
  };

  const update = (e, data) => {
    color === e ? setColor() : setColor(e);
    setRemove(data);
    if (state === true) {
      setState(false);
    } else {
      setState(true);
    }
  };
  const updatesub = (e, data) => {
    color === e ? setColor() : setColor(e);
    setRemovesub(data);
    if (state === true) {
      setState(false);
    } else {
      setState(true);
    }
  };

  const SaveChanges = async () => {
    if (input.length !== 0) {
      setList([...list, input]);
    }
    setShow(false);
    setPost(true);
    setInput("");
    if (color) {
      function Delete() {
        setList(list.filter((list) => remove !== list));
      }
      Delete();
    }
  };

  useEffect(() => {
    if (post === true) {
      setPost(false);
      const data = {
        istravel: false,
        blogCategory: list,
      };

      try {
        const res = axios.post(`api/admin/blogCategory`, data);
        if (res?.data?.code !== 200) return;
      } catch (err) {
        console.log(err);
      }
    }
  }, [post]);

  useEffect(() => {
    if (Modalshow === true) {
      setSub(subc?.filter((list) => list.category === remove));
      let news = subc?.filter((list) => list.category === remove);
      setSubarray(news[0]?.subcategory); ///changes
    } else {
      try {
        axios
          .get(`api/admin/blogCategory?istravel=${isTravel}`)
          .then((response) => {
            let newdata = response?.data?.data;

            setList(newdata.map((data) => data.category));
            setSub(response.data.data);
            // setAlldata(response.data.data);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, [Modalshow]);

  

 

  const SaveEditChanges = () => {
    if (inputsub.length !== 0) {
  
      setSubarray([...subarray, inputsub]);
    } else if (removesub) {
      function Delete() {
        setSubarray(subarray?.filter((sub) => removesub !== sub));
      }
      Delete();
    }
    setSubpostC(true);
    setShowsub(false);
    setInputsub("");
  };
  useEffect(() => {
    if (subpostC === true) {
      function subPosts() {
        const data = {
          category: remove,
          subcategory: subarray,
        };
        try {
          const res = axios.post("api/admin/addblogsubcategory", data);
          if (res?.data?.code !== 200) return;
        } catch (err) {
          console.log(err);
        }
        setInputsub("");
      }

      subPosts();
    }
    setSubpostC(false);
  }, [subpostC]);

  const handleShow = () => setModalShow(true);

////Travel theme

  const TravelBtn = () => {
    if (isTravel===false){
    setIsTravel(true);
    try {
      axios.get(`api/admin/blogCategory?istravel=true`).then((response) => {
        let newdata = response?.data?.data;
        setTravelmap(newdata.map((data) => data.category));
      });
    } catch (err) {
      console.log(err);
    }
  }
  else {
    setIsTravel(false);
    try {
      axios
        .get(`api/admin/blogCategory?istravel=false`)
        .then((response) => {
          let newdata = response?.data?.data;
          setList(newdata.map((data) => data.category));
          setSub(response.data.data);
          // setAlldata(response.data.data);
        });
    } catch (err) {
      console.log(err);
    }
  }
}

 
  const ShowTravelEdit = () => {
    setColor();
    if (travelshow === true) {
      setTravelShow(false);
    } else {
      setTravelShow(true);
    }
  };
  const Travelupdate = (e, data) => {
    color === e ? setColor() : setColor(e);
    setRemoveT(data);
    if (state === true) {
      setState(false);
    } else {
      setState(true);
    }
  };
  const SaveTravelChanges = async () => {
    if (inputtravel.length !== 0) {
      setTravelmap([...travelmap, inputtravel]);
    }
    setTravelShow(false);
    setTPost(true);
    setInputTravel("");
    if (color) {
      function Delete() {
        setTravelmap(travelmap.filter((travel) => removet !== travel));
      }
      Delete();
    }
  };
  useEffect(() => {
    if (Tpost === true) {
      setTPost(false);
      const data = {
        istravel: true,
        blogCategory: travelmap,
      };

      try {
        const res = axios.post("api/admin/blogCategory", data);
        if (res?.data?.code !== 200) return;
      } catch (err) {
        console.log(err);
      }
    }
  }, [Tpost]);

  if (!isLoading && !user?.isAdmin) navigate("/");
  if (isLoading) return null;

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <AdminSidebar selected={"categories"} />}
      <Container className="adminc-main">
        <div className="adminc-greet">
          <div className="adminc-head">Hello Admin!</div>
          <div className="adminc-shead">What are you doing today ?</div>
        </div>
        <div className="adminb-gu">
          <div
            className={`${!isTravel && "adminb-active"}`}
            onClick={TravelBtn}
          >
            Categories
          </div>
          {/* <div
            className={`adminb-ub ${isTravel && "adminb-active"}`}
            onClick={TravelBtn}
          >
            Travel Theme
          </div> */}
        </div>
        {!isTravel ? (
          <div className="adminc-categories">
            <button
              onClick={ShowEdit}
              className={show === true ? "edit-category" : "edit-category-btn"}
            >
              Edit
            </button>
            <Row>
              {list?.map((data, id) => {
                return (
                  <Col>
                    {" "}
                    <li className="list-name" onClick={() => update(id, data)}>
                      {show === true ? (
                        id === color ? (
                          <BsFillSquareFill
                            style={{
                              border: "2px solid #28318C",
                              color: "#fff",
                            }}
                          />
                        ) : (
                          <BsFillCheckSquareFill
                            style={{
                              backgroundColor: "#fff",
                              color: "#28318C",
                            }}
                          />
                        )
                      ) : (
                        ""
                      )}
                      {show === false ? (
                        <Button
                          clasName="sub-category"
                          onClick={handleShow}
                          Title="Add sub-category"
                          variant="success"
                        >
                          Add
                        </Button>
                      ) : (
                        ""
                      )}
                      &nbsp;{data}
                    </li>
                  </Col>
                );
              })}
            </Row>
            <Modal
              show={Modalshow}
              onHide={() => {
                setModalShow(false);
              }}
            >
              <Modal.Header closeButton>
                <h2>Category: {remove}</h2>
                <button
                  onClick={ShowSubEdit}
                  className={
                    showsub === true
                      ? "edit-subcategory"
                      : "edit-subcategory-btn"
                  }
                >
                  Edit
                </button>
              </Modal.Header>
              <Modal.Body>
                {/* SUBCATEGORY */}
                {/* <Row> */}
                <ul
                  style={{
                    listStyle: "none",
                    columns: 2,
                    webKitColumns: 2,
                    mozColumns: 2,
                    margin: "20px",
                    padding: "10px",
                  }}
                >
                  {subarray?.map((data, id) => {
                    return (
                      // <Col>
                      <>
                        <li
                          className="list-subcat"
                          onClick={(e) => updatesub(id, data)}
                        >
                          {showsub === true ? (
                            id === color ? (
                              <BsFillSquareFill
                                style={{
                                  border: "2px solid #28318C",
                                  color: "#fff",
                                }}
                              />
                            ) : (
                              <>
                                <BsFillCheckSquareFill
                                  style={{
                                    backgroundColor: "#fff",
                                    color: "#28318C",
                                  }}
                                />
                              </>
                            )
                          ) : (
                            ""
                          )}
                          &nbsp;{data}
                        </li>
                      </>
                    );
                  })}
                </ul>
                <input
                  style={{ fontSize: "17px", width: "90%", marginLeft: "22px" }}
                  className="input-category"
                  placeholder="Add New Category"
                  type="text"
                  value={inputsub}
                  onChange={(e) => setInputsub(e.target.value)}
                  name="inputsub"
                />
                {/* </Row> */}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={SaveEditChanges}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
            <Row>
              <Col>
                <div className="input-groupc">
                  <div className="adminc-input">
                    {show === false ? (
                      <>
                        <BsFillSquareFill style={{ color: "#fff" }} />
                      </>
                    ) : (
                      <>
                        <BsFillCheckSquareFill
                          style={{ backgroundColor: "#fff", color: "#28318C" }}
                        />
                        <input
                          className="input-category"
                          placeholder="Add New Category"
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          name="input"
                        />
                      </>
                    )}
                  </div>
                  {show === true ? (
                    <div className="save-category-btn">
                      <Button variant="primary" onClick={SaveChanges}>
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
            </Row>
          </div>
        ) : (
          ////Travel theme

          <div className="adminc-categories">
            <button
              onClick={ShowTravelEdit}
              className={
                travelshow === true ? "edit-category" : "edit-category-btn"
              }
            >
              Edit
            </button>
            <Row>
              {travelmap?.map((data, id) => {
                return (
                  <Col>
                    {" "}
                    <li 
                      className="list-name"
                      onClick={() => Travelupdate(id, data)}
                    >
                      {travelshow === true ? (
                        id === color ? (
                          <BsFillSquareFill
                            style={{
                              border: "2px solid #28318C",
                              color: "#fff",
                            }}
                          />
                        ) : (
                          <BsFillCheckSquareFill
                            style={{
                              backgroundColor: "#fff",
                              color: "#28318C",
                            }}
                          />
                        )
                      ) : (
                        ""
                      )}

                       {id+1}. {data}
                    </li>
                  </Col>
                );
              })}
            </Row>

            <Row>
              <Col>
                <div className="input-groupc">
                  <div className="adminc-input">
                    {travelshow === false ? (
                      <>
                        <BsFillSquareFill style={{ color: "#fff" }} />
                      </>
                    ) : (
                      <>
                        <BsFillCheckSquareFill
                          style={{ backgroundColor: "#fff", color: "#28318C" }}
                        />
                        <input
                          className="input-category"
                          placeholder="Add New Category"
                          type="text"
                          value={inputtravel}
                          onChange={(e) => setInputTravel(e.target.value)}
                          name="input"
                        />
                      </>
                    )}
                  </div>
                  {travelshow === true ? (
                    <div className="save-category-btn">
                      <Button variant="primary" onClick={SaveTravelChanges}>
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};

export default AdminCategories;
