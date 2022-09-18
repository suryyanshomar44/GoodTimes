import React, { useState, useEffect } from "react";
import { Container, InputGroup, Form, Spinner } from "react-bootstrap";
import Back from "../../assets/images/back.svg";
import Footer from "../common/Footer";
import Navbarr from "../common/Navbarr";
import Preview from "../common/Preview";
import { useNavigate, useLocation } from "react-router-dom";
import TextEditor from "../common/TextEditor";
import axios from "../../utils/axios";
import { storage } from "../../utils/firebaseConfig";
import { TiDeleteOutline } from "react-icons/ti";
function AdminEditBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState({
    metaDescription: "",
    metaKeywords: "",
    dynamicUrl: "",
  });
  const [data, setUserData] = useState();
  const [preview, setPreview] = useState(false);
  const [blog, setBlog] = useState("");
  const [blogText, setBlogText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [aboutAuthor, setAboutAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [themelist, setThemelist] = useState([]);
  const [theme, setTheme] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [categorylist, setCategorylist] = useState([]);
  const [subcategorylist, setSubcategorylist] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [thingstodo, setThingstodo] = useState("false");
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
  function GetBlog() {
    try {
      axios.get(`api/user/blog/${location?.state?.id}`).then((response) => {
        setUserData(response?.data?.data);
        if (response.data.code !== 200) throw navigate("/admin/promotedblogs");
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    GetBlog();
    Getcategory();
    Gettheme();
  }, []);
  console.log(data);
  console.log(selectedImage);
  console.log(previewImg);
  useEffect(() => {
    if (data) {
      setTitle(data?.title);
      setAuthorName(data?.userId?.username);
      setAboutAuthor(data?.userId?.about);
      setCategory(data?.category);
      setSubcategory(data?.subcategory);
      setTheme(data?.traveltheme);
      setThingstodo(data?.thingsToDo);
      setBlog(data?.content);
      setInput({
        metaDescription: data?.metaDescription,
        metaKeywords: data?.metaKeywords,
        dynamicUrl: data?.dynamicUrl,
      });
    }
  }, [data]);

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
    if (selectedImage !== null) {
      const uploadTask = storage
        .ref(
          `images/blog-thumbnail/${selectedImage.name}-${selectedImage.size}`
        )
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
              postGuestBlog(url);
            });
        }
      );
    } else {
      postGuestBlog();
    }
  };
  const postGuestBlog = async (url) => {
    let Newurl = selectedImage === null ? data.thumbnail : url;
    const Newdata = {
      username: authorName,
      about: aboutAuthor,
      title: title,
      category: category,
      subcategory: subcategory,
      content: blog,
      thumbnail: Newurl,
      blogText: blogText,
      traveltheme: "Wildlife",
      thingsToDo: thingstodo,
      metaKeywords: input.metaKeywords,
      metaDescription: input.metaDescription,
      dynamicUrl: input.dynamicUrl?.toLowerCase(),
    };
    console.log(Newdata);
    try {
      const res = await axios.put(
        `api/user/blog/${location.state.id}`,
        Newdata
      );
      setLoading(false);
      alert(res?.data?.message);
      navigate("/admin/promotedblogs");
    } catch (err) {
      const { response } = err;
      alert(response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbarr />
      <Container className="submit-main">
        <div className="submit-head">
          {" "}
          <span className="pb-right">
            <img
              src={Back}
              alt="back"
              className="pb-back"
              Title="Go Back"
              onClick={() => navigate("/admin/promotedblogs")}
            />
          </span>
          Edit Blog
        </div>
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
              className="submit-input"
              onChange={handleImageSelect}
            />

            {previewImg && (
              <div style={{ position: "relative" }}>
                <span
                  onClick={() => {
                    setPreviewImg(null);
                    setSelectedImage(null);
                  }}
                  style={{ position: "absolute", top: "10", right: "0" }}
                >
                  <TiDeleteOutline size="24" color="red" />
                </span>
                <img
                  src={previewImg}
                  alt="thumbnail"
                  className="submit-thumbnail"
                />
              </div>
            )}

            {!previewImg && (
              <img
                src={data?.thumbnail}
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
              blog={blog}
              setBlogText={setBlogText}
            />
            <button className="submit-btn1" onClick={() => setPreview(true)}>
              Preview
            </button>
            <button
              type="submit"
              className="submit-btn2"
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
        {preview === true && <Preview title={title} blog={blog} />}
      </Container>
      <Footer />
    </>
  );
}

export default AdminEditBlog;
