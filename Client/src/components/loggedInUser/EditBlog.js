import React, { useState, useContext, useEffect } from "react";
import { Container, Spinner, } from "react-bootstrap";
import Footer from "../common/Footer";
import Preview from "../common/Preview";
import TextEditor from "../common/TextEditor";
import axios from "../../utils/axios";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import Back from "../../assets/images/back.svg";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../utils/userContext";
import { storage } from "../../utils/firebaseConfig";
function EditBlog() {
  const navigate = useNavigate();
  let BlogId = useParams();
  let blog_id = BlogId.id;
  const { user, isLoading } = useContext(UserContext);
  const [userdata, setUserData] = useState([]);
  const [sidebarShow, setSidebarShow] = useState(false);
  const [preview, setPreview] = useState(false);
  const [blog, setBlog] = useState("");
  const [blogText, setBlogText] = useState("");
  const [loading, setLoading] = useState(false);
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
    const GetBlog = () => {
      try {
        axios.get(`api/user/blog/${blog_id}`).then((response) => {
          setUserData(response.data.data);
          if (response.data.code !== 200) throw navigate("/blogs");
        });
      } catch (err) {
        console.log(err);
      }
    };
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
    GetBlog();
    Getcategory();
    Gettheme();
  }, []);
  console.log(userdata);
  const uniquecategory = [
    ...new Set(categorylist?.flat()?.map((data) => data?.category)),
  ];
  const uniquetheme = [
    ...new Set(themelist?.flat()?.map((data) => data?.category)),
  ];

  useEffect(() => {
    if (category?.length !== 0) {
      let sublist = categorylist?.filter((sub) => sub?.category === category);
      setSubcategorylist(sublist);
    }
  }, [category]);
  useEffect(() => {
    if (userdata.length !== 0) {
      setTitle(userdata.title);
      setCategory(userdata.category);
      setSubcategory(userdata.subcategory);
      setTheme(userdata.traveltheme);
      setThingstodo(userdata?.thingstodo?.toString());
      setBlog(userdata.content);
      setBlogText(userdata.blogText);
      setPreviewImg(userdata.thumbnail);
    }
  }, [userdata]);

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
            data.thumbnail = url;

            postUserBlog(data);
          });
      }
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!title) {
      alert("please select title");
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
      traveltheme: theme,
      thingsToDo: thingstodo,
      thumbnail: previewImg,
      isDraft: false,
    };
    if (selectedImage) {
      handleImageUploadandSave(data);
    } else {
      postUserBlog(data,false);
    }
  };

  const handleDraft = (e) => {
    e.preventDefault();
    const data = {
      title: title,
      category: category,
      subcategory: subcategory,
      content: blog,
      blogText: blogText,
      isDraft: true,
      traveltheme: theme,
      thingsToDo: thingstodo,
      thumbnail: previewImg,
    };
    if (selectedImage) {
      handleImageUploadandSave(data);
    } else {
      postUserBlog(data, true);
    }
  };
  const previewBlog = (e) => {
    e.preventDefault();
    setPreview(true);
  };

  const postUserBlog = async (data, e) => {
    console.log(data);
    try {
      let api = e
        ? axios.post("api/user/blog", data)
        : axios.put(`api/user/blog/${blog_id}`, data);
      const res = await api;
      console.log(res);
      alert(res?.data?.message);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    navigate("/blogs");
  };

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <Sidebar selected={"blogs"} />}
      <Container className="publish-main">
        <img
          src={Back}
          alt="back"
          className="publish-back"
          Title="Back"
          onClick={() => navigate("/")}
        />
        <span className="publish-head">Edit Blog</span>
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

            <select
              required
              value={theme}
              onChange={handletheme}
              className="submit-input"
            >
              <option value="" disabled>
                Select Theme
              </option>
              {uniquetheme?.map((data, id) => {
                return (
                  <option value={data} key={id}>
                    {data}
                  </option>
                );
              })}
            </select>
            <span className="coupon-input">
              <label for="thingstodo" style={{ color: "#cbcbcb" }}>
                Things To Do
              </label>
              &nbsp;&nbsp;&nbsp;
              <input
                type="checkbox"
                placeholder="thingstodo"
                name="thingstodo"
                value={thingstodo}
                onClick={(e) =>
                  setThingstodo(e.target.value === "true" ? "false" : "true")
                }
              />
            </span>
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

export default EditBlog;
