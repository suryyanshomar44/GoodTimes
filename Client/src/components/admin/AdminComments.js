import React, { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import "./AdminComments.css";
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
    <div className="adminc-comment" key={id}>
      <div>
        <img
          src={comment?.isGuest ? User : comment?.userId?.profile || User}
          alt="user"
          className="adminc-user"
        />
        <span className="adminc-name">
          {comment?.isGuest ? comment?.username : comment?.userId?.username}
        </span>
      </div>
      <div className="adminc-cb">{comment?.comment}</div>
      <div className="adminc-ar">
        <div className="adminc-rej" onClick={() => rejectComment(comment?._id)}>
          Reject
        </div>
        <div
          className="adminc-app"
          onClick={() => approveComment(comment?._id)}
        >
          Approve
        </div>
      </div>
      <hr />
    </div>
  );
};

function AdminComments() {
  const navigate = useNavigate();
  const [sidebarShow, setSidebarShow] = useState(false);
  const [commentIndex, setCommentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [comments, setComments] = useState([]);
  const { user, isLoading } = useContext(UserContext);

  const getAllComments = async (commentIndex) => {
    try {
      const res = await axios.get(`/api/admin/comment/${commentIndex}`);
      console.log(res);
      if (res?.data?.code !== 200) return;
      if (res?.data?.data?.length < 1) {
        setHasMore(false);
        return;
      }
      console.log("have data");
      setComments((comments) => [...comments, ...res?.data?.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const infiniteScroll = () => {
    if (
      Math.round(window.innerHeight + window.scrollY) >=
      document.body.offsetHeight
    ) {
      setCommentIndex((commentIndex) => commentIndex + 1);
      // console.log("kjdfadf");
      // console.log(commentIndex);
    }
  };

  const updateCommentList = (commentId) => {
    setComments(comments.filter((comment) => comment?._id !== commentId));
  };

  useEffect(() => {
    window.addEventListener("scroll", infiniteScroll);
    return () => {
      window.removeEventListener("scroll", infiniteScroll);
    };
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    getAllComments(commentIndex);
    // console.log("commentIndex", commentIndex);
  }, [hasMore, commentIndex]);

  if (!isLoading && !user?.isAdmin) navigate("/");
  if (isLoading) return null;

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <AdminSidebar selected={"comments"} />}
      <Container className="adminc-main">
        <div className="adminc-greet">
          <div className="adminc-head">Hello Admin!</div>
          <div className="adminc-shead">What are you doing today ?</div>
        </div>
        <div className="adminc-comments">
          <div className="adminc-chead">Comments</div>
          {comments.map((comment, id) => {
            return (
              <Comment
                comment={comment}
                id={id}
                updateCommentList={updateCommentList}
              />
            );
          })}
        </div>
      </Container>
    </>
  );
}

export default AdminComments;
