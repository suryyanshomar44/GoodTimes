import React, { useState, useEffect } from "react";
import { Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import "./AllList.css";
import { NavLink, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import Navbarr from "../common/Navbarr";
import Footer from "../common/Footer";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Filter from "../../assets/images/Filter.png";
import { RadioGroup, ReversedRadioButton } from "react-radio-buttons";
import { BsSearch } from "react-icons/bs";
function AllBlogs() {
  let urlid = useParams();
  let url = urlid?._id;
  const [data, setData] = useState();
  const [showFilter, setFilter] = useState(false);
  const [populardata, setPopulardata] = useState();
  const [ratedata, setRatedata] = useState();
  const [categoryData, setCategorydata] = useState();
  const [input, setInput] = useState("");
  const [blogs, setBlogs] = useState();
  const [popularvalue, setPopularvalue] = useState();
  const [ratingvalue, setRatingvalue] = useState();
  const [date, setDate] = useState({ Start: "", End: "" });
  const [topbtn, setTopbtn] = useState({
    Sort: true,
    Rate: true,
    Popularity: true,
  });
  useEffect(() => {
    function GetData() {
      try {
        axios.get(`api/guest/recentblogs`).then((response) => {
          if (url === "all") {
            setData(response.data.data);
          } else if (url === "Technology") {
            setData(
              response.data.data.filter((ele) => ele?.category === "Technology")
            );
          } else if (url === "Food") {
            setData(
              response.data.data.filter((ele) => ele?.category === "Food")
            );
          } else {
            setData(response.data.data);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }

    GetData();
  }, []);

  useEffect(() => {
    function GetPopulardata() {
      try {
        axios.get(`api/guest/mostviewedblogs`).then((response) => {
          if (url === "all") {
            setPopulardata(
              response.data.data
            );
          } else if (url === "Technology") {
            setPopulardata(
              response.data.data.filter(
                (ele) => ele?.category === "Technology"
              )
            );
          } else if (url === "Food") {
            setPopulardata(
              response.data.data.filter((ele) => ele?.category === "Food")
            );
          } else {
            setPopulardata(
              response.data.data
            );
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
    if (ratedata?.length > 0) {
      GetPopulardata();
    }
  }, [ratedata]);
  useEffect(() => {
    function GetRatedata() {
      try {
        axios.get(`api/user/getblogsviarating`).then((response) => {
          if (url === "all") {
            setRatedata(
              response.data.blogs
            );
          } else if (url === "Technology") {
            setRatedata(
              response.data.blogs.filter(
                (ele) => ele?.category === "Technology"
              )
            );
          } else if (url === "Food") {
            setRatedata(
              response.data.blogs.filter((ele) => ele?.category === "Food")
            );
          } else {
            setRatedata(
              response.data.blogs
            );
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
    if (data?.length > 0) {
      GetRatedata();
    }
  }, [data]);

  useEffect(() => {
    function GetCategorydata() {
      try {
        axios.post(`api/guest/categoryblogs`).then((response) => {
          if (url === "all") {
            setCategorydata(
              response?.data?.data
            );
          } else if (url === "Technology") {
            setCategorydata(
              response.data.data.filter(
                (ele) => ele?.category === "Technology"
              )
            );
          } else if (url === "Food") {
            setCategorydata(
              response.data.data.filter((ele) => ele?.category === "Food")
            );
          } else {
            setCategorydata(
              response.data.data
            );
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
    if (populardata?.length > 0) {
      GetCategorydata();
    }
  }, [populardata]);

  useEffect(() => {
    if (data?.length > 0) {
      setBlogs(data);
    }
  }, [data]);

  const SortbyDate = () => {
    if (topbtn.Sort === false) {
      setTopbtn({ Sort: true });
      setBlogs([...data]);
    } else {
      setTopbtn({ Sort: false });
      setBlogs([...data].reverse());
    }
    setFilter(false);
  };

  const SortbyRating = () => {
    if (topbtn.Rate === false) {
      setTopbtn({ Rate: true });
      setBlogs([...ratedata]);
    } else {
      setTopbtn({ Rate: false });
      setBlogs([...ratedata].reverse());
    }
    setFilter(false);
  };
  const SortbyPopularity = () => {
    if (topbtn.Popularity === false) {
      setTopbtn({ Popularity: true });
      setBlogs([...populardata]);
    } else {
      setTopbtn({ Popularity: false });
      setBlogs([...populardata].reverse());
    }
    setFilter(false);
  };

  const FilterPannel = () => {
    showFilter === false ? setFilter(true) : setFilter(false);
    setInput("");
  };
  useEffect(() => {
    if (showFilter === true) {
      setBlogs([...data]);
    }
  }, [showFilter]);

  const PopularRadio = (e) => {
    setPopularvalue(e);
  };
  const RatingRadio = (e) => {
    setRatingvalue(e);
  };

  const DatePicker = () => {
    let result = blogs.filter(
      (datep) =>
        datep?.createdAt.slice(0, 10) <= date.End &&
        datep?.createdAt.slice(0, 10) >= date.Start
    );
    if (!date.Start) {
      alert("Select a Valid Start-Date");
    } else if (!date.End) {
      alert("Select a Valid End-Date");
    } else {
      setBlogs(result);
      setFilter(false);
      setDate({ Start: "", End: "" });
    }
  };
  const Ratingfilter = () => {
    let result;
    if (ratingvalue === "5") {
      result = ratedata.filter(
        (rate) => rate?.avgrating <= 5 && rate?.avgrating >= 4
      );
    } else if (ratingvalue === "4") {
      result = ratedata.filter(
        (rate) => rate?.avgrating <= 4 && rate?.avgrating >= 3
      );
    } else if (ratingvalue === "3") {
      result = ratedata.filter(
        (rate) => rate?.avgrating <= 3 && rate?.avgrating >= 2
      );
    } else if (ratingvalue === "2") {
      result = ratedata.filter(
        (rate) => rate?.avgrating <= 2 && rate?.avgrating >= 1
      );
    } else if (ratingvalue === "1") {
      result = ratedata.filter(
        (rate) => rate?.avgrating <= 1 && rate?.avgrating >= 0
      );
    }
    setBlogs(result);
    setFilter(false);
  };
  const Popularfilter = () => {
    let result;
    if (popularvalue === "1000+") {
      result = blogs.filter((view) => view?.viewCount >= 1000);
    } else if (popularvalue === "1000") {
      result = blogs.filter(
        (view) => view?.viewCount <= 1000 && view?.viewCount >= 700
      );
    } else if (popularvalue === "700") {
      result = blogs.filter(
        (view) => view?.viewCount <= 700 && view?.viewCount >= 400
      );
    } else if (popularvalue === "400") {
      result = blogs.filter(
        (view) => view?.viewCount <= 400 && view?.viewCount >= 200
      );
    } else if (popularvalue === "200") {
      result = blogs.filter(
        (view) => view?.viewCount <= 200 && view?.viewCount >= 0
      );
    }
    setBlogs(result);
    setFilter(false);
  };
  const Categoryfilter = () => {
    let result;
    result = categoryData.filter((category) => category?.subcategory === input);

    setBlogs(result);
    setInput("");
    setFilter(false);
  };

  const unique = [
    ...new Set(categoryData?.flat().map((data) => data?.subcategory)),
  ];
  return (
    <>
      <Navbarr />
      <Container className="all-list-main">
        <div className="list-explore">
          Explore{" "}
          <span style={{ textTransform: "capitalize" }}>
            {url}
          </span>
        </div>
        <div className="Sort-filter">
          <p className="Sort-text">Sort by</p>{" "}
          <button
            className="Sort-Button"
            onClick={SortbyDate}
            title={topbtn.Sort === true ? "Latest Blogs" : "Oldest Blogs"}
          >
            Date{" "}
            {topbtn.Sort === false ? (
              <IoMdArrowDropup size="25px" />
            ) : (
              <IoMdArrowDropdown size="25px" />
            )}
          </button>{" "}
          <button
            className="Sort-Button"
            onClick={SortbyRating}
            title={topbtn.Rate === true ? "Highest Rating" : "Lowest Rating"}
          >
            Rating{" "}
            {topbtn.Rate === false ? (
              <IoMdArrowDropup size="25px" />
            ) : (
              <IoMdArrowDropdown size="25px" />
            )}
          </button>{" "}
          <button
            className="Sort-Button"
            onClick={SortbyPopularity}
            title={
              topbtn.Popularity === true
                ? "Most-Popular Blogs"
                : "Less Popular Blogs"
            }
          >
            Popularity{" "}
            {topbtn.Popularity === false ? (
              <IoMdArrowDropup size="25px" />
            ) : (
              <IoMdArrowDropdown size="25px" />
            )}
          </button>
          <div
            className="filter-container"
            onClick={FilterPannel}
            title="Filter"
          >
            <p className="Sort-text">Filter</p>
            <img
              src={Filter}
              style={{ width: "35px", height: "35px", marginLeft: "10px" }}
              alt="filter"
            />
          </div>
        </div>

        <div
          className="Filter-main"
          style={{ display: showFilter === false ? "none" : "grid" }}
        >
          <Row>
            <Col lg={4}>
              <Row>
                <div className="Filter-container">
                  <p className="Filter-date-text">Filter by Date</p>
                  <Row>
                    <Col>
                      <input
                        type="date"
                        className="blog-Date-picker"
                        name="Start Date"
                        value={date.Start}
                        onChange={(e) =>
                          setDate({ ...date, Start: e.target.value })
                        }
                      />
                    </Col>

                    <Col>
                      <input
                        type="date"
                        className="blog-Date-picker"
                        name="End date"
                        value={date.End}
                        onChange={(e) =>
                          setDate({ ...date, End: e.target.value })
                        }
                      />
                    </Col>
                  </Row>
                  <div className="Filter-button-div">
                    <button className="Filter-Button" onClick={DatePicker}>
                      Filter
                    </button>
                  </div>
                </div>
              </Row>

              {/* <Row style={{ paddingTop: "30px", paddingBottom: "30px" }}>
                <div className="Filter-container">
                  <p className="Filter-date-text">Filter by Destination</p>
                  <div className="Filter-category">
                    <InputGroup className="mb-3" size="lg">
                      <FormControl
                        className="Search-field-filter"
                        placeholder="Search Destinations"
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                        }}
                      />
                      <InputGroup.Text
                        id="basic-addon1"
                        onClick={Categoryfilter}
                      >
                        <BsSearch />
                      </InputGroup.Text>
                    </InputGroup>
                  </div>

                  <div
                    className="filter-SearchR"
                    style={
                      input == "" ? { display: "none" } : { display: "grid" }
                    }
                  >
                    {unique
                      ?.filter((val) => {
                        if (input === "") {
                          return null;
                        } else if (
                          val?.toLowerCase()?.includes(input?.toLowerCase())
                        ) {
                          return val;
                        } else {
                          return null;
                        }
                      })
                      .slice(0, 3)
                      .map((val, key) => {
                        return (
                          <p
                            className="SearchR-text"
                            key={key}
                            onClick={() => setInput(val)}
                          >
                            {val}
                          </p>
                        );
                      })}
                  </div>

                  <div className="Filter-button-div">
                    <button className="Filter-Button" onClick={Categoryfilter}>
                      Filter
                    </button>
                  </div>
                </div>
              </Row> */}
            </Col>
            <Col lg={4}>
              <div className="Filter-container">
                <p className="Filter-date-text">Filter by Ratings</p>
                <div>
                  <RadioGroup onChange={RatingRadio}>
                    <ReversedRadioButton
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                      value="5"
                    >
                      <h4> 5 - 4 Star</h4>
                    </ReversedRadioButton>
                    <ReversedRadioButton
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                      value="4"
                    >
                      <h4> 4 - 3 Star </h4>
                    </ReversedRadioButton>
                    <ReversedRadioButton
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                      value="3"
                    >
                      <h4> 3 - 2 Star </h4>
                    </ReversedRadioButton>
                    <ReversedRadioButton
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                      value="2"
                    >
                      <h4> 2 - 1 Star </h4>
                    </ReversedRadioButton>
                    <ReversedRadioButton
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                      value="1"
                    >
                      <h4> 1 - 0 Star </h4>
                    </ReversedRadioButton>
                  </RadioGroup>
                </div>
                <div className="Filter-button-div">
                  {" "}
                  <button className="Filter-Button" onClick={Ratingfilter}>
                    Filter
                  </button>{" "}
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="Filter-container">
                <p className="Filter-date-text">Filter by Popularity</p>

                <div>
                  <RadioGroup onChange={PopularRadio}>
                    <ReversedRadioButton
                      value="1000+"
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                    >
                      <h4> 1000+ Views </h4>
                    </ReversedRadioButton>
                    <ReversedRadioButton
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                      value="1000"
                    >
                      <h4> 1000 - 700 Views </h4>
                    </ReversedRadioButton>
                    <ReversedRadioButton
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                      value="700"
                    >
                      <h4> 700 - 400 Views </h4>
                    </ReversedRadioButton>
                    <ReversedRadioButton
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                      value="400"
                    >
                      <h4> 400 - 200 Views </h4>
                    </ReversedRadioButton>
                    <ReversedRadioButton
                      pointColor={"#23A6F0"}
                      rootColor={"#9e9b9b"}
                      iconInnerSize={9.9}
                      iconSize={20}
                      value="200"
                    >
                      <h4> 200 - 0 Views </h4>
                    </ReversedRadioButton>
                  </RadioGroup>
                </div>
                <div className="Filter-button-div">
                  {" "}
                  <button className="Filter-Button" onClick={Popularfilter}>
                    Filter
                  </button>{" "}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {blogs?.map((data, id) => {
          return (
            <Row className="list-row" key={id}>
              <Col lg={2} xs={3} md={3}>
                <img
                  src={data?.thumbnail}
                  alt={data?.title}
                  className="list-img-blogs"
                />
              </Col>
              <Col lg={10} xs={9} md={9}>
                <NavLink
                  className="navlink-css"
                  to={{ pathname: `/particular-blog/${data?._id}` }}
                  state={{ blog_id: data?._id }}
                >
                  <div className="list-content">
                    <div className="list-heading">{data?.title}</div>
                    <div className="list-subheading">
                      {data?.blogText.slice(0, 220)}...
                    </div>
                  </div>
                </NavLink>
              </Col>
            </Row>
          );
        })}
      </Container>
      <Footer />
    </>
  );
}

export default AllBlogs;
