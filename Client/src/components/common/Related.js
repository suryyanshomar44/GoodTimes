import React, { useState, useEffect } from "react";
import "./Related.css";
import axios from "../../utils/axios";
import { NavLink } from "react-router-dom";
function Related() {
  const [data, setData] = useState();

  useEffect(() => {
    function GetData() {
      try {
        axios.get(`api/guest/recentblogs`).then((response) => {
          setData(response.data.data);
        });
      } catch (err) {
        console.log(err);
      }
    }

    GetData();
  }, []);
  return (
    <div className="related-main">
      <div className="related-heading">Latest Posts</div>
      {data?.slice(-4).reverse().map((data, id) => {
        return (
          <div className="related-content" key={id}>
            <NavLink
              className="navlink-css"
              to={{pathname:`/particular-blog/${data?._id}`}}
              state={{ blog_id: data?._id }}
            >
              <div className="related-odd">
                {data?.blogText.slice(0, 150)}...<span className="read-more-text">Read more</span>
              </div>
            </NavLink>
          </div>
        );
      })}
    </div>
  );
}

export default Related;
