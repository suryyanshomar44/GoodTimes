import React, { useState, useContext, useEffect } from "react";
import "./AdminDashboard.css";
import { Container, Row, Col } from "react-bootstrap";
import BlogImg from "../../assets/images/ablog.svg";
import User from "../../assets/images/user.svg";
import Header from "../common/Header";
import AdminSidebar from "../common/AdminSidebar";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import axios from "../../utils/axios";

const Comment = ({ comment, id, updateCommentList }) => {
  const rejectComment = async (commentId) => {
    try {
      const res = await axios.delete(`/api/admin/comment/${commentId}`);
      if (res?.data?.code !== 200) {
        alert(res?.data?.message);
        return;
      }
      updateCommentList(commentId);
    } catch (err) {
      console.log(err);
    }
  };

  const approveComment = async (commentId) => {
    try {
      const res = await axios.put(`/api/admin/comment/${commentId}`);
      if (res?.data?.code !== 200) {
        alert(res?.data?.message);
        return;
      }
      updateCommentList(commentId);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="admind-comment">
      <div>
        <img
          src={comment?.isGuest ? User : comment?.userId?.profile || User}
          alt="user"
          className="admind-user"
        />
        <span className="admind-name">
          {comment?.isGuest ? comment?.username : comment?.userId?.username}
        </span>
      </div>
      <div className="admind-cb">{comment?.comment}</div>
      <div className="admind-ar">
        <div
          className="admind-rej admind-pad"
          onClick={() => rejectComment(comment?._id)}
        >
          Reject
        </div>
        <div
          className="admind-app"
          onClick={() => approveComment(comment?._id)}
        >
          Approve
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [sidebarShow, setSidebarShow] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [hasMoreUserBlogs, setHasMoreUserBlogs] = useState(true);
  const [userBlogIndex] = useState(0);

  const updateCommentList = (commentId) => {
    setComments(comments.filter((comment) => comment?._id !== commentId));
  };

 

  

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const res = await axios.get("/api/admin/comment/0");
        if (res?.data?.code !== 200) return;
        setComments(res?.data?.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllComments();
  }, []);

  useEffect(() => {
    const getUserBlogs = async () => {
      try {
        const res = await axios.get(
          `api/admin/blog?blogIndex=0&isGuestBlogs=false`
        );
        console.log(res);
        if (res?.data?.code !== 200) return;
        if (res?.data?.data?.length < 1) {
          setHasMoreUserBlogs(false);
          return;
        }
        setUserBlogs((userBlogs) => [...userBlogs, ...res?.data?.data]);
      } catch (err) {
        console.log(err);
      }
    };
    if (!hasMoreUserBlogs) return;
    getUserBlogs(userBlogIndex);
  }, [hasMoreUserBlogs, userBlogIndex]);

  if (!isLoading && !user?.isAdmin) navigate("/");
  if (isLoading) return null;


  const acceptbtn = async (_id) => {
    try {
      const res = await axios.put(`api/admin/blog/${_id}`);
      if (res?.data?.code !== 200) {
        alert(res?.data?.message);
        return;
      }
    } catch (err) {
      console.log(err);
    }
    setUserBlogs(userBlogs.filter((userBlog) => userBlog._id !== _id));
   
  };

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <AdminSidebar selected={"dashboard"} />}
      <Container className="admind-main">
        <div className="admind-greet">
          <div className="admind-head">Hello Admin!</div>
          <div className="admind-shead">What are you doing today ?</div>
        </div>
        <Row>
          <Col lg={8}>
            <div className="admind-ablog">
              <div className="admind-abhead">Blogs</div>
              {userBlogs.slice(0,3).map((blog, id) => {
                return (
                  <div className="admind-blog" key={id}>
                    <img
                      src={blog?.thumbnail ? blog.thumbnail : BlogImg}
                      alt="blog"
                      className="adminb-img"
                    />
                    <div className="admind-blogc">
                      <div className="admind-blogt">{blog?.title}</div>
                      <div className="admind-blogb">
                        {blog?.blogText?.slice(0, 80)}
                      </div>
                      <div className="admind-ar">
                        <div className="admind-rej">Reject</div>
                        <div className="admind-app" onClick={() => acceptbtn(blog._id)}>Approve</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div
                className="admind-show"
                onClick={() => navigate("/admin/blogs")}
              >
                show all
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="admind-comments">
              <div className="admind-chead">Comments</div>
              {comments.map((comment, id) => {
                return (
                  <Comment
                    comment={comment}
                    id={id}
                    updateCommentList={updateCommentList}
                  />
                );
              })}
              <div
                className="admind-show"
                onClick={() => navigate("/admin/comments")}
              >
                show all
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard;
