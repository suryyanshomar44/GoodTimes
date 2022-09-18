import React, { useState, useEffect } from "react";
import { Container, FormControl, InputGroup } from "react-bootstrap";
import ReactSearchBox from "react-search-box";
import { NavLink } from "react-router-dom";
import Navbarr from "../common/Navbarr";
import Footer from "../common/Footer";
import axios from "../../utils/axios";
import "./SearchPage.css";
import { BsSearch } from "react-icons/bs";
import {ImCross } from "react-icons/im";
const SearchPage = () => {
  const [data, setData] = useState();
  const [input, setInput] = useState("");
  let title = true;
  useEffect(() => {
    function GetData() {
      try {
        axios
          .get(`api/guest/searchblogs?search_text=${input}`)
          .then((response) => {
            setData(response.data.data);
          });
      } catch (err) {
        console.log(err);
      }
    }

    GetData();
  }, [input]);

  return (
    <div>
      <Navbarr />
      <Container>
        <div className="SearchPage-main">
          <div className="SearchPage">Search Here</div>
          <div className="Searchbar">
            <div className="Filter-category">
              <InputGroup className="mb-3" size="lg">
                <FormControl
                  className="Search-field-bt"
                  placeholder="Search Blogs or Titles"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                />
                <InputGroup.Text id="basic-addon1" title={input===""?"Search":"Delete"}onClick={() => setInput("")}>
                  {input===""?<BsSearch fontSize="15" />:<ImCross fontSize="15" style={{cursor: "pointer"}}/>}
                </InputGroup.Text>
              </InputGroup>
            </div>

            <div
              className="SearchResult-bt"
              style={input == "" ? { display: "none" } : { display: "grid" }}
            >
              {data
                ?.filter((val) => {
                  if (input === "") {
                    return null;
                  } else if (
                    val?.blogText?.toLowerCase()?.includes(input?.toLowerCase())
                  ) {
                    title = false;
                    return val;
                  } else if (
                    val?.title?.toLowerCase()?.includes(input?.toLowerCase())
                  ) {
                    title = true;
                    return val;
                  } else {
                    return null;
                  }
                })
                .map((val, key) => {
                  return (
                    <p className="SearchR-text" key={key}>
                      <NavLink
                        className="navlink-css"
                        to={{ pathname: `/particular-blog/${val?._id}` }}
                        state={{ blog_id: val?._id }}
                      >
                        {title === true
                          ? val?.title
                          : val?.blogText.slice(0, 100)+"....."}
                      </NavLink>
                    </p>
                  );
                })}
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default SearchPage;
