import React, { useState, useContext, useEffect } from "react";
import {  Container, InputGroup, Form,Spinner, } from "react-bootstrap";
import Footer from "../common/Footer";
import Preview from "../common/Preview";
import TextEditor from "../common/TextEditor";
import "./UserPublish.css";
import axios from "../../utils/axios";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import Back from "../../assets/images/back.svg";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import { storage } from "../../utils/firebaseConfig";
import SubmitBanner from "../submit/SubmitBanner";
function UserPublish() {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);
  const [sidebarShow, setSidebarShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    metaDescription: "",
    metaKeywords: "",
    dynamicUrl: "",
  });
  const [preview, setPreview] = useState(false);
  const [blog, setBlog] = useState("");
  const [blogText, setBlogText] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [categorylist, setCategorylist] = useState([]);
  const [subcategorylist, setSubcategorylist] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [themelist, setThemelist] = useState([]);
  const [theme, setTheme] = useState([]);
  const [thingstodo, setThingstodo] = useState("false");
  useEffect(() => {
    function Getcategory() {
      try {
        axios.get("api/admin/blogCategory?istravel=false").then((response) => {
          setCategorylist(response.data.data);
          // if (response.data.code !== 200) throw history("/blogs");
        });
      } catch (err) {
        console.log(err);
      }
    }

    function Gettheme() {
      try {
        axios.get("api/admin/blogCategory?istravel=true").then((response) => {
          setThemelist(response.data.data);
        });
      } catch (err) {
        console.log(err);
      }
    }

    Getcategory();
    Gettheme();
  }, []);

  const uniquecategory = [
    ...new Set(categorylist?.flat()?.map((data) => data?.category)),
  ];
  const uniquetheme = [
    ...new Set(themelist?.flat()?.map((data) => data?.category)),
  ];

  useEffect(() => {
    if (category.length !== 0) {
      let sublist = categorylist?.filter((sub) => sub?.category === category);
      setSubcategorylist(sublist);
    }
  }, [category]);

  if (!isLoading && !user) navigate("/");
  if (isLoading) return null;

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSubcategory("");
  };
  const handleSubCategory = (e) => {
    setSubcategory(e.target.value);
  };
  const handletheme = (e) => {
    setTheme(e.target.value);
  };
  const handleImageSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedImage(e.target.files[0]);
    setPreviewImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleImageUploadandSave = (data) => {
    const uploadTask = storage
      .ref(`images/blog-thumbnail/${selectedImage.name}-${selectedImage.size}`)
      .put(selectedImage);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images/blog-thumbnail")
          .child(`${selectedImage.name}-${selectedImage.size}`)
          .getDownloadURL()
          .then((url) => {
            // setuploadedImageUrl(url);
            data.thumbnail = url;
            postUserBlog(data);
          });
      }
    );
  };
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    if (!title) {
      alert("please select title");
      return;
    }
    if (!selectedImage) {
      alert("please select thumbnail");
      return;
    }
    if (!category) {
      alert("please add category");
      return;
    }
    if (!subcategory) {
      alert("please add sub-category");
      return;
    }
    if (!blog) {
      alert("please add blog content");
      return;
    }
    const data = {
      title: title,
      category: category,
      content: blog,
      blogText: blogText,
      subcategory: subcategory,
      traveltheme: "Wildlife",
      thingsToDo: thingstodo,
      metaKeywords: input.metaKeywords,
      metaDescription: input.metaDescription,
      dynamicUrl: input.dynamicUrl.toLowerCase(),
    };
    handleImageUploadandSave(data);
  };

  const handleDraft = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      title: title,
      category: category,
      subcategory: subcategory,
      content: blog,
      blogText: blogText,
      isDraft: true,
      traveltheme: "Wildlife",
      thingsToDo: thingstodo,
      dynamicUrl: input.dynamicUrl.toLowerCase(),
    };
    handleImageUploadandSave(data);
  };
  const previewBlog = (e) => {
    e.preventDefault();
    setPreview(true);
  };

  const postUserBlog = async (data) => {
    console.log(data);
    try {
      const res = await axios.post("api/user/blog", data);
      console.log(res);
      setLoading(false);
      alert(res?.data?.message);
      navigate("/blogs");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <Sidebar selected={"blogs"} />}
      <Container className="publish-main">
        <div className="coupon-banner">
          <SubmitBanner />
        </div>
        <img
          src={Back}
          alt="back"
          className="publish-back"
          Title="Back"
          onClick={() => navigate("/")}
        />
        <span className="publish-head">Publish Blog</span>
        <div className="publish-form">
          <form>
            <input
              type="text"
              placeholder="Enter Blog Title"
              required
              className="publish-input"
              value={title}
              onChange={handleTitle}
            />
            <label className="publish-sthumb">Select Thumbnail</label>
            <input
              type="file"
              placeholder="Thumbnail"
              accept="image/png, image/jpeg"
              required
              className="publish-input"
              onChange={handleImageSelect}
            />
            {previewImg && (
              <img
                src={previewImg}
                alt="thumbnail"
                className="publish-thumbnail"
              />
            )}
            <select
              value={category}
              onChange={handleCategory}
              className="publish-input"
              required
            >
              <option value="" disabled>
                Category
              </option>
              {uniquecategory?.map((data, id) => {
                return (
                  <option value={data} key={id}>
                    {data}
                  </option>
                );
              })}
            </select>
            {subcategorylist?.length > 0 ? (
              <select
                required
                value={subcategory}
                onChange={handleSubCategory}
                className="submit-input"
              >
                <option value="" disabled>
                  Sub-Category
                </option>
                {subcategorylist[0]?.subcategory?.map((data, id) => {
                  return (
                    <option value={data} key={id}>
                      {data}
                    </option>
                  );
                })}
              </select>
            ) : (
              ""
            )}

            <label className="publish-sthumb">Blog URL</label>
            <InputGroup className="submit-input">
              <InputGroup.Text style={{ height: "50px" }}>
                {window?.location?.origin + "/"}
              </InputGroup.Text>
              <Form.Control
                style={{ height: "50px" }}
                type="text"
                placeholder="Enter your Blog URL"
                // className="my-2"
                value={input.dynamicUrl}
                onChange={(e) =>
                  setInput({ ...input, dynamicUrl: e.target.value })
                }
              />
            </InputGroup>

            <label className="publish-sthumb"> Meta Description</label>
            <textarea
              type="text"
              rows="3"
              placeholder="Meta Description"
              className="submit-input"
              value={input.metaDescription}
              onChange={(e) =>
                setInput({ ...input, metaDescription: e.target.value })
              }
            />
            <label className="publish-sthumb">Meta Keywords</label>
            <textarea
              type="text"
              rows="2"
              placeholder="Keywords"
              className="publish-input"
              value={input.metaKeywords}
              onChange={(e) =>
                setInput({ ...input, metaKeywords: e.target.value })
              }
            />

            <TextEditor
              setBlog={setBlog}
              setBlogText={setBlogText}
              blog={blog}
            />
            <button className="publish-btn1" onClick={handleDraft}>
              Save as Draft
            </button>
            <button className="publish-btn1" onClick={previewBlog}>
              Preview
            </button>
            <button
              type="submit"
              className="publish-btn2"
              onClick={handleSubmit}
              disabled={loading ? true : false}
            >
             {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    ></Spinner>
                    &nbsp; Loading...
                  </>
                ) : (
                  "Submit"
                )}
            </button>
          </form>
        </div>
        {preview === true && (
          <Preview title={title} blog={blog} blogText={blogText} />
        )}
      </Container>
      <Footer />
    </>
  );
}

export default UserPublish;
