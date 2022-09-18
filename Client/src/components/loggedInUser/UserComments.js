import React, { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import "./UserComments.css";
import User from "../../assets/images/user.svg";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import axios from "../../utils/axios";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const Comment = ({ comments, Title,id }) => {
  const [show, setShow] = useState(false);
  const[result,setResult] = useState();
  const ShowComments = (e) => {
    if (show === true) {
      setShow(false);
      setResult(comments.filter((comments) => comments?.targetuser?.title === e));
    } else {
      setShow(true);
      setResult(comments.filter((comments) => comments?.targetuser?.title === e));
    }
  };
  return (
    <div className="userc-comment ">
      
      <div>
        <span className="usercnd-name" onClick={() => ShowComments(Title)} Title={show === false ? 'Open Comments' : 'Close Comments'}>
         {id+1}) {Title} {show === false ? <TiArrowSortedDown /> : <TiArrowSortedUp />}
        </span>
      </div>
      
      <div style={{ display: show === true ? "grid" : "none",paddingTop:'30px',paddingLeft:'10px' }}>
     
{result?.map((data, id) =>{
  return(
     <>
        <div key={id}>
        <img
          src={data?.isGuest ? User : data?.user?.profile || User}
          alt="user"
          className="admind-user"
        />
        <span className="userc-Title-blog">
          {!data?.username ? data?.user?.username : data?.username}
        </span>
       </div>
        <div className="userc-cb">
          {" "}
          <span className="userc-Title-comment">Comment:</span>
          <span className="userc-blog-comment">{data?.comment}</span> 
       
       {/* {result?.length>1?<hr/>:""}  */}
      </div>
      </>
)})}
 <div className="userc-cb">
          {" "}
          <span className="userc-Total-comment">Total : </span>
          <span className="userc-TotalT-comment">{result?.length} Comments</span> 
        </div>
 </div>
      <hr />
    </div>
  );
};

function UserComments() {
  const navigate = useNavigate();
  const [sidebarShow, setSidebarShow] = useState(false);
  const [commentIndex, setCommentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [comments, setComments] = useState([]);
  const { user, isLoading } = useContext(UserContext);

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const res = await axios.get("/api/user/getcomments");
        if (res?.status !== 200) return;
        setComments(res?.data?.comments);
      } catch (err) {
        console.log(err);
      }
    };
    getAllComments();
  }, []);

  const unique = [
    ...new Set(comments?.flat().map((data) => data.targetuser?.title)),
  ];

  if (!isLoading && !user) navigate("/");
  if (isLoading) return null;

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <Sidebar selected={"comments"} />}
      <Container className="userc-main">
        <div className="userc-comments">
          <h2>All User Blogs</h2>
          {unique?.map((Title, id) => {

            return (
            <Comment key={id} id={id} Title={Title} comments={comments} />);
          })}
        </div>
      </Container>
    </>
  );
}

export default UserComments;
