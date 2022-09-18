import React, { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Header from "../common/Header";
import AdminSidebar from "../common/AdminSidebar";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import axios from "../../utils/axios";

const AdminSeo = () => {
  const [sidebarShow, setSidebarShow] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);
  const [seo, setSeo] = useState([]);
  const [input, setInput] = useState({
    title: "",
    keywords: "",
    description: "",
    id: "",
  });

  const GetSEO = () => {
    try {
      axios.get("/api/admin/seo").then((response) => {
        setSeo(response.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async () => {
    try {
      const res = await axios.put(`api/admin/seo`, input);
      if (res?.data?.code !== 200) {
        alert(res?.data?.message);
        window.location.reload();
        return;
      }
    } catch (err) {
      console.log(err);
    }
    
    GetSEO();
    
  };

  useEffect(() => {
    GetSEO();
  }, []);

  useEffect(() => {
    if (seo.length !== 0) {
      setInput({
        title: seo[0].title,
        keywords: seo[0].keywords,
        description: seo[0].description,
        id: seo[0]._id,
      });
    }
  }, [seo]);

  if (!isLoading && !user?.isAdmin) navigate("/");
  if (isLoading) return null;

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <AdminSidebar selected={"seo"} />}
      <Container className="adminv-main">
        <div className="adminv-comments">
          <label className="publish-sthumb">Website Title</label>
          <input
            type="text"
            placeholder="EnterTitle"
            required
            className="publish-input"
            value={input.title}
            onChange={(e) => setInput({ ...input, title: e.target.value })}
          />

          <label className="publish-sthumb"> Meta Description</label>
          <textarea
            type="text"
            rows="4"
            placeholder="Meta Description"
            required
            className="submit-input"
            value={input.description}
            onChange={(e) => setInput({ ...input, description: e.target.value })}
          />
          <label className="publish-sthumb">Meta Keywords</label>
          <textarea
            type="text"
            rows="4"
            placeholder="Change Name"
            required
            className="publish-input"
            value={input.keywords}
            onChange={(e) => setInput({ ...input, keywords: e.target.value })}
          />
          <button type="button" className="publish-btn2" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </Container>
    </>
  );
};

export default AdminSeo;
