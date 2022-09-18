import React, { useState, useEffect } from "react";
import "./Comments.css";
import User from "../../assets/images/user.svg";
import axios from "../../utils/axios";

function Comments(props) {
  const [commentIndex, setCommentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [comments, setComments] = useState([]);
  const getAllComments = async (commentIndex) => {
    try {
      const res = await axios.get(
        `/api/user/comment/${props?.BlogId}/${commentIndex}`
      );

      if (res?.data?.code !== 200) return;
      if (res?.data?.data?.length < 1) {
        setHasMore(false);
        return;
      } else {
        setComments((comments) => [...res?.data?.data]);
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
      setCommentIndex((commentIndex) => commentIndex + 1);
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
    getAllComments(commentIndex);
  }, [hasMore, commentIndex]);
  useEffect(() => {
    getAllComments(commentIndex);
  }, [props?.BlogId]);

  return (
    <div className="cmts-comments">
      <div className="cmts-chead">Comments</div>
      {comments.map((comment, id) => {
        return (
          <div className="cmts-comment" key={id}>
            <div>
              <img
                src={comment?.isGuest ? User : comment?.userId?.profile || User}
                alt="user"
                className="cmts-user"
              />
              <span className="cmts-name">
                {comment?.isGuest
                  ? comment?.username
                  : comment?.userId?.username}
              </span>
            </div>
            <div className="cmts-cb">{comment?.comment}</div>
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default Comments;
