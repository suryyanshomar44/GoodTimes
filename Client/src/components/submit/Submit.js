import React, { useState, useEffect } from "react";
import { Container, InputGroup, Form, Spinner, } from "react-bootstrap";
import Footer from "../common/Footer";
import Navbarr from "../common/Navbarr";
import Preview from "../common/Preview";
import { useNavigate } from "react-router-dom";
import TextEditor from "../common/TextEditor";
import "./Submit.css";
import axios from "../../utils/axios";
import { storage } from "../../utils/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubmitBanner from "./SubmitBanner";
function Submit() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(false);
  const [blog, setBlog] = useState("");
  const [input, setInput] = useState({
    metaDescription: "",
    metaKeywords: "",
    dynamicUrl: "",
  });
  const [blogText, setBlogText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [aboutAuthor, setAboutAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [themelist, setThemelist] = useState([]);
  const [theme, setTheme] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [categorylist, setCategorylist] = useState([]);
  const [subcategorylist, setSubcategorylist] = useState([]);
  const [subcategory, setSubcategory] = useState("");
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
  const handleAuthorName = (e) => {
    setAuthorName(e.target.value);
  };

  const handleAboutAuthor = (e) => {
    setAboutAuthor(e.target.value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSubcategory("");
  };
  const handletheme = (e) => {
    setTheme(e.target.value);
  };

  const handleSubCategory = (e) => {
    setSubcategory(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
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
    handleImageUploadandSave();
  };

  const handleImageSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedImage(e.target.files[0]);
    setPreviewImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleImageUploadandSave = () => {
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
            postGuestBlog(url);
          });
      }
    );
  };
  const postGuestBlog = async (url) => {
    const data = {
      username: authorName,
      about: aboutAuthor,
      title: title,
      category: category,
      subcategory: subcategory,
      content: blog,
      thumbnail: url,
      blogText: blogText,
      traveltheme: "Wildlife",
      thingsToDo: thingstodo,
      metaKeywords: input.metaKeywords,
      metaDescription: input.metaDescription,
      dynamicUrl: input.dynamicUrl.toLowerCase(),
    };
    try {
      const res = await axios.post("api/guest/blog", data);
      alert(res?.data?.message);
      navigate("/blogs");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    toast.info(
      <div className="Toast-notify">
        Start Your Blogging Journey with us
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  }, []);

  return (
    <>
      <Navbarr />
      <Container className="submit-main">
        <div className="coupon-banner">
          <SubmitBanner />
        </div>
        <div className="submit-head">Submit Blog</div>
        <div className="submit-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Name"
              className="submit-input"
              required
              value={authorName}
              onChange={handleAuthorName}
            />
            <textarea
              type="text"
              rows="5"
              placeholder="About the Author"
              required
              className="submit-input"
              value={aboutAuthor}
              onChange={handleAboutAuthor}
            />
            <input
              type="text"
              placeholder="Enter Blog Title"
              required
              className="submit-input"
              value={title}
              onChange={handleTitle}
            />
            <label className="submit-sthumb">Select Thumbnail</label>
            <input
              type="file"
              placeholder="Thumbnail"
              accept="image/png, image/jpeg"
              required
              className="submit-input"
              onChange={handleImageSelect}
            />
            {previewImg && (
              <img
                src={previewImg}
                alt="thumbnail"
                className="submit-thumbnail"
              />
            )}
            <select
              required
              value={category}
              onChange={handleCategory}
              className="submit-input"
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
            {/* SUBCATEGORY */}
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
            <button className="submit-btn1" onClick={() => setPreview(true)}>
              Preview
            </button>
            <button type="submit" className="submit-btn2" disabled={loading ? true : false}>
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

        <ToastContainer />
      </Container>
      <Footer />
    </>
  );
}

export default Submit;
