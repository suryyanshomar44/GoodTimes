import React, { useState, useContext, useEffect } from "react";
import "./ActiveBanner.css";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../common/Header";
import AdminSidebar from "../common/AdminSidebar";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import axios from "../../utils/axios";
import { storage } from "../../utils/firebaseConfig";
import Select from "react-select";
import ImageUploading from "react-images-uploading";
import {
  MdAddAPhoto,
  MdOutlineRemoveCircle,
  MdOutlineSmartDisplay,
} from "react-icons/md";

const ActiveBanners = () => {
  const [images, setImages] = useState([]);
  const [id, setId] = useState();
  const [upload, setUpload] = useState(false);
  const [sidebarShow, setSidebarShow] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);
  const [preview, setPreview] = useState(null);
  const [values, setValues] = useState("");

  const [geturl, setUrl] = useState([]);

  const handleImageUploadAndSave = () => {
    const uploadTask = storage
      .ref(`images/avatar/${images[id]?.file?.name}-${images[id]?.file?.size}`)
      .put(images[id]?.file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images/avatar")
          .child(`${images[id]?.file?.name}-${images[id]?.file?.size}`)
          .getDownloadURL()

          .then((url) => {
            setUrl([...geturl, url]);

            // handleSave(url);
          });
      }
    );
  };

  useEffect(() => {
    if (upload === true) {
      handleImageUploadAndSave();
    }
    setUpload(false);
  }, [id]);

  const handleSave = async (url) => {
    if (images?.length === 0) {
      alert("Select Banner image");
      return;
    }
    if (geturl?.length === 0) {
      alert("Upload Banner First");
      return;
    }
    if (!values) {
      alert("Select Page to Display Banner");
      return;
    } else {
      const data = {
        images: geturl,
        type: values?.value,
      };
      try {
        const res = await axios.post("api/admin/publicimages", data);
        alert(res?.data?.message);
        navigate("/admin/dashboard");
        if (res?.data?.code !== 200) return;
      } catch (err) {
        console.log(err);
      }
    }
  };
  const options = [
    { value: "Home", label: "Home" },
    { value: "SubmitBlog", label: "SubmitBlog" },
  ];

  const changeHandler = (values) => {
    setValues(values);
  };
  const onChange = (imageList) => {
    setImages(imageList);
  };
  if (!isLoading && !user?.isAdmin) navigate("/");
  if (isLoading) return null;

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <AdminSidebar selected={"activebanners"} />}
      <Container className="adminv-main">
        <div className="adminv-greet">
          <div className="adminb-gu">
            <Container className="coupon-main">
              <Row>
                <Col className="order-lg-2">
                  <div className="App">
                    <ImageUploading
                      multiple
                      value={images}
                      onChange={onChange}
                      maxNumber={10}
                      dataURLKey="data_url"
                    >
                      {({
                        imageList,
                        onImageUpload,
                        onImageRemoveAll,
                        onImageRemove,

                        dragProps,
                      }) => (
                        <div className="upload__image-wrapper">
                          <button
                            className="bannerbtn"
                            onClick={() => {
                              onImageUpload();
                            }}
                            {...dragProps}
                          >
                            <MdAddAPhoto style={{ marginTop: "-4px" }} /> Click
                            to Add Banner
                          </button>
                          &nbsp;
                          <button
                            className="bannerbtn"
                            onClick={() => {
                              onImageRemoveAll();
                              setPreview(null);
                              setUrl([]);
                            }}
                          >
                            Remove All
                          </button>
                          {imageList.map((image, index) => {
                            setId(index);
                            setUpload(true);
                            return (
                              <>
                                <div
                                  key={index}
                                  className="banner-sm-preview"
                                  style={{ display: "flex" }}
                                >
                                  <img
                                    className="banner-sm-img"
                                    src={image["data_url"]}
                                    alt="img"
                                  />
                                  <div className="image-item__btn-wrapper">
                                    <button
                                      title="Remove"
                                      className="banner-img-btn"
                                      onClick={() => {
                                        onImageRemove(index);
                                        setPreview(null);
                                        setUrl(geturl.splice(index, 1));
                                        setUpload(false);
                                      }}
                                    >
                                      <MdOutlineRemoveCircle />
                                    </button>
                                    <button
                                      title="Preview"
                                      className="banner-img-btn"
                                      onClick={() =>
                                        setPreview(images[index].data_url)
                                      }
                                    >
                                      <MdOutlineSmartDisplay size={28} />
                                    </button>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      )}
                    </ImageUploading>

                    <div>
                      {preview == null ? (
                        <img
                          style={{ display: "none" }}
                          alt="uploadCoupon"
                          className="actbanner-img"
                        />
                      ) : (
                        <img
                          src={preview}
                          alt="uploadCoupon"
                          className="actbanner-img"
                        />
                      )}
                    </div>

                    <Select
                      placeholder="Select Banner For"
                      className="coupon-input"
                      options={options}
                      value={values}
                      onChange={changeHandler}
                    />

                    <button
                      type="submit"
                      className="coupon-btn"
                      onClick={handleSave}
                    >
                      Update Banner
                    </button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ActiveBanners;
