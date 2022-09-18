import React, { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import "./UserInsights.css";
import GraphView from "../common/GraphView";
import GraphShare from "../common/GraphShare";
import GraphComment from "../common/GraphComment";
// import Blog from "../../assets/images/tblog.svg";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import axios from "../../utils/axios";

const UserInsights = () => {
  const [sidebarShow, setSidebarShow] = useState(false);
  const navigate = useNavigate();
  const [allstat, setAllStat] = useState();
  const [monthstat, setMonthStat] = useState();
  const { user, isLoading } = useContext(UserContext);

  //for Total stat
  useEffect(() => {
    function AllTimestats() {
      try {
        axios.get("api/user/stat?isAllTime=true").then((response) => {
          setAllStat(response.data);
          if (response.data.code !== 200) throw navigate("/");
        });
      } catch (err) {
        console.log(err);
      }
    }
    function Monthstats() {
      try {
        axios.get("api/user/stat?isTabular=true").then((response) => {
          setMonthStat(response.data?.data);
          if (response.data.code !== 200) throw navigate("/");
        });
      } catch (err) {
        console.log(err);
      }
    }
    Monthstats();
    AllTimestats();
  }, []);
  //for month

  console.log(monthstat);
  console.log(allstat);
  if (!isLoading && !user) navigate("/");
  if (isLoading) return null;

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <Sidebar selected={"insights"} />}
      <Container className="inst-main">
        <div className="inst-sec1">
          <div className="inst-sh">You Have Received (All Time)</div>
          <div className="inst-vals">
            <div className="inst-part">
              <div className="inst-val">{allstat?.data[0]?.viewCount}</div>
              <div className="inst-name">Blog-Views</div>
            </div>
            <div className="inst-part">
              <div className="inst-val">{allstat?.data[0]?.shareCount}</div>
              <div className="inst-name">Shares</div>
            </div>
            <div className="inst-part">
              <div className="inst-val">{allstat?.data[0]?.commentCount}</div>
              <div className="inst-name">Comments</div>
            </div>
          </div>
        </div>
        <div className="inst-box">
          <div className="inst-title">
            {allstat?.data[0]?.viewCount} Blog Views (This Month)
          </div>
          <GraphView />
        </div>
        <div className="inst-box">
          <div className="inst-title">
            {allstat?.data[0]?.shareCount} Shares (This Month)
          </div>
          <GraphShare />
        </div>
        <div className="inst-box">
          <div className="inst-title">
            {allstat?.data[0]?.commentCount} Comments (This Month)
          </div>
          <GraphComment />
        </div>
        <div className="inst-box">
          <div className="inst-title">Blog Performance (This Month)</div>
          <div className="inst-head">
            <div className="inst-bf">Blog</div>
            <div>Views</div>
            <div>Shares</div>
            <div className="inst-bl">Comments</div>
          </div>
          <hr />
          {monthstat?.map((count, id) => {
            {
              return (
                <>
                  <div className="inst-row" key={id}>
                    <div className="inst-bc">
                      <div>
                      <img
                        src={count?.blog[0]?.thumbnail}
                        className="user-img"
                        alt="blog"
                      />
</div>
                      <div>
                        <div className="inst-bt">{count?.blog[0]?.title}</div>
                        <div className="inst-bp">Published 30 Nov 2021</div>
                      </div>
                    </div>
                    <div className="inst-num">{count.viewCount}</div>
                    <div className="inst-num">{count.shareCount}</div>
                    <div className="inst-bl inst-num">{count.commentCount}</div>
                  </div>
                  <hr />
                </>
              );
            }
          })}
        </div>
      </Container>
    </>
  );
};

export default UserInsights;
