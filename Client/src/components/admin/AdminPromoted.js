import React, { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import "./AdminBlogs.css";
import View from "../../assets/images/bview.svg";
import Share from "../../assets/images/bshare.svg";
import { BiHide } from "react-icons/bi";
import Comments from "../../assets/images/bcomment.svg";
import Header from "../common/Header";
import AdminSidebar from "../common/AdminSidebar";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import { FcApproval } from "react-icons/fc";
import { FiEdit } from "react-icons/fi";
import axios from "../../utils/axios";
function AdminPromoted() {
  const [blogs, setBlogs] = useState(true);
  const [allblogs, setAllBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(true);
  const [promoted, setPromoted] = useState();
  const [sidebarShow, setSidebarShow] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);
  const [BlogIndex, setBlogIndex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const getAllComments = async (BlogIndex) => {
    try {
      const res = await axios.get(
        `api/guest/mostviewedblogs?page=${BlogIndex}`
      );
      if (res?.status !== 200) return;
      if (res?.data?.data?.length < 1) {
        setHasMore(false);
        return;
      }
      if (allblogs?.length < 1) {
        setAllBlogs([res?.data?.data]);
      } else {
        setAllBlogs([...allblogs, res?.data?.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const infiniteScroll = () => {
    if (
      Math.round(window.innerHeight + window.scrollY) >=
      document.body.offsetHeight
    ) {
      setBlogIndex((BlogIndex) => BlogIndex + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", infiniteScroll);
    return () => {
      window.removeEventListener("scroll", infiniteScroll);
    };
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    getAllComments(BlogIndex);
  }, [hasMore, BlogIndex]);

  ////
  let result;
  useEffect(() => {
    if (allblogs?.length > 0) {
      setUsers(allblogs?.flat());
    }
  }, [allblogs]);
  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempUser = users?.map((user) => {
        return { ...user, isChecked: checked };
      });
      setUsers(tempUser);
    } else {
      let tempUser = users?.map((user) =>
        user.title === name ? { ...user, isChecked: checked } : user
      );
      setUsers(tempUser);
    }
  };

  useEffect(() => {
    if (blogs === true) {
      function GetData() {
        try {
          const res = axios.get(`api/guest/mostviewedblogs?page=${BlogIndex}`);
          if (res?.status !== 200) return;
          if (res?.data?.data?.length < 1) {
            setHasMore(false);
            return;
          }
          console.log(allblogs?.length);
          if (allblogs?.length < 1) {
            setAllBlogs([res?.data?.data]);
          } else {
            setAllBlogs([...allblogs, res?.data?.data]);
          }
        } catch (err) {
          console.log(err);
        }
      }
      GetData();
    }
  }, [blogs]);

  useEffect(() => {
    function GetData() {
      try {
        axios.get(`api/guest/promotedblogs`).then((response) => {
          setPromoted(response.data.data);
        });
      } catch (err) {
        console.log(err);
      }
    }

    GetData();
  }, []);
  useEffect(() => {
    if (blogs === false || show === true) {
      function GetData() {
        try {
          axios.get(`api/guest/promotedblogs`).then((response) => {
            setPromoted(response?.data.data);
          });
        } catch (err) {
          console.log(err);
        }
      }

      GetData();
    }
  }, [blogs, show]);

  result = users?.filter((users) => users?.isChecked === true);

  let promotedId = result.map((user) => user._id);

  const PromotedBlogs = async (e) => {
    e.preventDefault();
    result = users?.filter((users) => users?.isChecked === true);

    const blogids = {
      blogids: promotedId,
    };
    if (result.length === 5) {
      try {
        const res = await axios.post("api/admin/promoteblogs", blogids);
        alert(res?.data?.message);
        Editbtn();
        navigate("/");
        if (res?.data?.code !== 200) return;
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Select Only 5 Promote Blogs to update");
    }
  };

  const Editbtn = () => {
    setBlogs(false);
    if (show === true) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const hideviewblog = (e, s) => {
    const data = {
      blogid: e,
      status: s === false ? true : false,
    };

    try {
      const res = axios.post("api/admin/setstate", data);
      alert(s === false ? "view hidden" : "view showed");
      if (res?.data?.code !== 200) return;
    } catch (err) {
      console.log(err);
    }
  };

  if (!isLoading && !user?.isAdmin) navigate("/");
  if (isLoading) return null;

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <AdminSidebar selected={"promotedBlogs"} />}
      <Container className="adminb-main">
        <div className="adminb-greet">
          <div className="adminb-head">Hello Admin!</div>
          <div className="adminb-shead">What are you doing today ?</div>
        </div>
        <div className="adminb-ablog">
          <div className="adminb-gu">
            <div
              className={`${blogs && "adminb-active"}`}
              onClick={() => {
                setBlogs(true);
                setShow(true);
              }}
            >
              All Blogs
            </div>
            <div
              className={`adminb-ub ${!blogs && "adminb-active"}`}
              onClick={() => {
                setBlogs(false);
                setShow(true);
              }}
            >
              Promoted Blogs
            </div>
            <div className="adminb-ub" onClick={Editbtn}>
              Edit
            </div>
          </div>

          {blogs ? (
            allblogs?.flat()?.map((data, id) => {
              return (
                <>
                  <div className="Blog-box" key={id}>
                    <img id="item-0ub" src={data?.thumbnail} alt="blog" />
                    <div id="item-1ub" title="edit blogs" style={{cursor:"pointer"}}>
                      {data?.title}{" "}
                      &nbsp;&nbsp; <span
                        style={{ color: "red" }}
                        onClick={() => navigate('/admin/promotedblogs/editblog',{state:{id:data._id}})}
                      >
                        <FiEdit  color="red"/> Edit
                      </span>
                    </div>
                    <div id="item-2ub">
                      {data?.blogText?.slice(0, 150) + "..."}
                      {/* <span className="more-text">more</span> */}
                    </div>
                    <div id="item-3ub">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => hideviewblog(data?._id, data.status)}
                      >
                        {data.status === false ? (
                          <img src={View} alt="view" title="Hide-views" />
                        ) : (
                          <BiHide size={33} title="Show-views" />
                        )}
                      </span>
                      <span> &nbsp; {data?.viewCount}</span>
                      <img className="item-share" src={Share} alt="share" />
                      <span> &nbsp; {data?.shareCount}</span>
                      <img className="item-share" src={Comments} alt="share" />
                      <span> &nbsp; {data?.commentCount}</span>&nbsp;
                      <span
                        className="item-comments-span-ub"
                        style={{
                          display: data?.isPromoted === true ? "grid" : "none",
                        }}
                      >
                        {" "}
                        &nbsp; Promoted
                      </span>
                    </div>
                  </div>
                </>
              );
            })
          ) : show === true ? (
            promoted?.map((data, id) => {
              return (
                <>
                  <div
                    className="Blog-box"
                    key={id}
                    style={{ display: show === true ? "grid" : "none" }}
                  >
                    <img id="item-0ub" src={data?.thumbnail} alt="blog" />
                    <div id="item-1ub">{data?.title}</div>
                    <div id="item-2ub">
                      {data?.blogText.slice(0, 150) + "..."}
                      {/* <span className="more-text">more</span> */}
                    </div>
                    <div id="item-3ub">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => hideviewblog(data?._id, data.status)}
                      >
                        {data.status === false ? (
                          <img src={View} alt="view" title="Hide-views" />
                        ) : (
                          <BiHide size={33} title="Show-views" />
                        )}
                      </span>
                      <span> &nbsp; {data?.viewCount}</span>
                      <img className="item-share" src={Share} alt="share" />
                      <span> &nbsp; {data?.shareCount}</span>
                      <img className="item-share" src={Comments} alt="share" />
                      <span> &nbsp; {data?.commentCount}</span>
                      <span
                        className="item-comments-span-ub"
                        style={{
                          display: data?.isPromoted === true ? "grid" : "none",
                        }}
                      >
                        {" "}
                        &nbsp; Promoted
                      </span>
                    </div>
                  </div>
                </>
              );
            })
          ) : show === false ? (
            <div className="container my-4">
              <div className="form w-100">
                <h3>Select Blogs</h3>
                <div
                  className="form-check"
                  style={{ marginTop: "15px", marginBottom: "15px" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="allSelect"
                    checked={
                      users.filter((user) => user?.isChecked !== true).length <
                      1
                    }
                    // checked={!users?.some((user) => user?.isChecked !== true)}
                    onChange={handleChange}
                  />
                  <label className="form-check-label ms-2">All Select</label>
                </div>
                {users?.map((user, index) => (
                  <div className="form-check" key={index}>
                    <FcApproval
                      title="Promoted Blogs"
                      style={{
                        display: user?.isPromoted ? "inline-flex" : "none",
                      }}
                    />
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name={user.title}
                      checked={user?.isChecked || false}
                      onChange={handleChange}
                    />

                    <label className="form-check-label ms-2">
                      {user.title}
                    </label>
                  </div>
                ))}
                <button className="Filter-Button" onClick={PromotedBlogs}>
                  Update
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </Container>
    </>
  );
}

export default AdminPromoted;
