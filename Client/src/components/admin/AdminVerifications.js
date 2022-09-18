import React, { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import "./AdminVerifications.css";
import Header from "../common/Header";
import AdminSidebar from "../common/AdminSidebar";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import axios from "../../utils/axios";

const AdminVerifications = () => {
  const [sidebarShow, setSidebarShow] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);
  const [verifyreq, setVerifyreq] = useState();
  const [updatestate, setUpdatestate] = useState(0);
  const [checkreq, setCheckreq] = useState("User Verification Requests");

  const rejectbtn = async (reject_id) => {
    try {
      const res = await axios.delete(
        `api/admin/requestVerification/${reject_id}`
      );
      if (res?.data?.code !== 200) {
        alert(res?.data?.message);
        return;
      }
    } catch (err) {
      console.log(err);
    }
    if (updatestate === 0) {
      setUpdatestate(1);
    } else {
      setUpdatestate(0);
    }
    alert('user rejected')
  };
  const acceptbtn = async (reject_id) => {
    try {
      const res = await axios.put(
        `api/admin/requestVerification/${reject_id}`
      );
      if (res?.data?.code !== 200) {
        alert(res?.data?.message);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  
    if (updatestate === 0) {
      setUpdatestate(1);
    } else {
      setUpdatestate(0);
    }
    alert('user verified')
  };
  const GetreqData = () => {
    try {
      axios
        .get("api/admin/requestVerification?verificationRequestIndex=0")
        .then((response) => {
          setVerifyreq(response.data);
          if (verifyreq?.data.length === 0) {
            setCheckreq("No Pending request");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetreqData();
  }, []);

  useEffect(() => {
    GetreqData();
  }, [updatestate]);

  if (!isLoading && !user?.isAdmin) navigate("/");
  if (isLoading) return null;

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <AdminSidebar selected={"userVerification"} />}
      <Container className="adminv-main">
        <div className="adminv-greet">
          <div className="adminv-head">Hello Admin!</div>
          <div className="adminv-shead">What are you doing today ?</div>
        </div>
        <div className="adminv-comments">
          <div className="adminv-chead">
            {verifyreq?.data.length === 0 ? "No Pending request" : checkreq}
          </div>

          {/* comment */}

          {verifyreq?.data.map((data, id) => {
            return (
              <>
                <div className="adminv-comment" key={id}>
                  <div>
                    <img
                      src={data?.userId?.profile}
                      alt="user"
                      className="adminv-user"
                    />
                    <span className="adminv-name">
                      {data?.userId?.username}
                    </span>
                  </div>
                  <div className="adminv-cb">{data?.userId?.about}</div>
                  <div className="adminv-ar">
                    <div
                      className="adminv-rej"
                      onClick={() => rejectbtn(data?._id)}
                    >
                      Reject
                    </div>
                    <div
                      className="adminv-app"
                      onClick={() => acceptbtn(data?._id)}
                    >
                      Approve
                    </div>
                  </div>
                  <hr />
                </div>
              </>
            );
          })}
          {/* end */}
        </div>
      </Container>
    </>
  );
};

export default AdminVerifications;
