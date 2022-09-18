import React, { useState, useContext, useRef, useMemo, useEffect } from "react";
import "./AdminAddCoupons.css";
import uploadCoupon from "../../assets/images/uploadCoupon.svg";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../common/Header";
import AdminSidebar from "../common/AdminSidebar";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import axios from "../../utils/axios";
import { storage } from "../../utils/firebaseConfig";
import Select from "react-select";
import countryList from "react-select-country-list";

const AdminAddCoupons = () => {
  const image = useRef(null);
  const [sidebarShow, setSidebarShow] = useState(false);
  const [store, setAllstore] = useState();
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [countryvalue, setCountryValue] = useState([]);
  const options = useMemo(() => countryList().getData(), []);
  const [BrandName, setBrandName] = useState("")
  const[storeid,setStoreid] = useState("")
  const [inputData, setInputData] = useState({
    Title: "",
    WebsiteLink: "",
    Bio: "",
    From: "",
    To: "",
    Couponcode: "",
    Deal: "",
    TopRecommendation: false,
  });

  useEffect(() => {
    function GetStore() {
      try {
        axios.get("api/admin/getstores").then((response) => {
          setAllstore(response.data.data?.map((data) => {
            return {
              label: data.name,
              value: data.name,
              id:data._id
            };
          }));
        });
      } catch (err) {
        console.log(err);
      }
    }
    GetStore();
  }, []);
console.log(inputData)
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  if (!isLoading && !user?.isAdmin) navigate("/");
  if (isLoading) return null;
  const handleClick = () => {
    image.current.click();
  };

  const handleImageSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedImage(e.target.files[0]);
    URL.createObjectURL(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleImageUploadAndSave = (e) => {
    e.preventDefault();
    const {Title, WebsiteLink, Bio, Couponcode, Deal, From, To } =
      inputData;
    if (!selectedImage) {
      alert("Add Coupon image");
      return;
    }
    if (!BrandName) {
      alert("BrandName is required Field");
      return;
    }
    if (!Title) {
      alert("Title is required Field");
      return;
    }
    if (!WebsiteLink) {
      alert("Website-Link is required Field");
      return;
    }
    if (!Bio) {
      alert("Bio is required Field");
      return;
    }
    if (!Couponcode) {
      alert("Coupon-Code is required Field");
      return;
    }
    if (!Deal) {
      alert("Deal is required Field");
      return;
    }
    if (!From) {
      alert("From is required Field");
      return;
    }
    if (!To) {
      alert("To is required Field");
      return;
    } else {
      const uploadTask = storage
        .ref(`images/avatar/${selectedImage.name}-${selectedImage.size}`)
        .put(selectedImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images/avatar")
            .child(`${selectedImage.name}-${selectedImage.size}`)
            .getDownloadURL()
            .then((url) => {
              handleSave(url);
            
            });
        }
      );
    }
  };
  const handleSave = async (url) => {
    const {
      Title,
      WebsiteLink,
      Bio,
      Couponcode,
      Deal,
      From,
      To,
      TopRecommendation,
    } = inputData;
    const multipleCountry = [...new Set(countryvalue?.flat()?.map((data) => data?.label))];
 
    const data = {
      brandName: BrandName.label,
      title: Title,
      websiteLink: WebsiteLink,
      bio: Bio,
      couponCode: Couponcode,
      deal: Deal,
      image: url,
      from: From,
      to: To,
      country: multipleCountry,
      storeid: storeid,
      isTopRecomendation: TopRecommendation,
    };
    try {
      const res = await axios.post("api/admin/coupon", data);
      alert(res?.data?.message);
      if (res?.data?.code !== 200) return;
      navigate("/admin/coupons");
    } catch (err) {
      console.log(err);
    }
  };

  const changeHandler = (Cvalue) => {
    setCountryValue(Cvalue);
  };
  const changeBrand = (Cvalue) => {
    setBrandName(Cvalue);
    setStoreid(Cvalue.id)
  };


  const CTopRecommendation = () => {
    if (inputData.TopRecommendation === true) {
      setInputData({...inputData,TopRecommendation: false });
    } else {
      setInputData({...inputData,TopRecommendation: true });
    }
  };
 
  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <AdminSidebar selected={"coupons"} />}
      <Container className="adminv-main">
        <div className="adminv-greet">
          <div className="adminv-head">Hello Admin!</div>
          <div className="adminv-shead">What are you doing today ?</div>
          <div className="adminb-ablog">
            <div className="adminb-gu">
              <Container className="coupon-main">
                <Row>
                  <Col lg={2} className="order-lg-2">
                    <div className="userp-sec1" onClick={() => handleClick}>
                      {preview == null ? (
                        <img
                          src={uploadCoupon}
                          alt="uploadCoupon"
                          className="coupon-img"
                        />
                      ) : (
                        <img
                          src={preview}
                          alt="uploadCoupon"
                          className="coupon-img"
                        />
                      )}
                      <span className="upload-txt"> Upload Image</span>

                      <input
                        type="file"
                        ref={image}
                        accept="image/png, image/jpeg"
                        className="selector-image"
                        onChange={handleImageSelect}
                      />
                    </div>
                  </Col>
                  <Col lg={10} className="order-lg-2">
                    <div className="coupon-form">
                      <form>
                      <Select
                           placeholder="Brand Name"
                          className="coupon-input"
                     
                          options={store}
                          required
                          name="BrandName"
                          value={BrandName}
                          onChange={changeBrand}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              neutral0: "#f1f1f1",
                            },
                          })}
                        />
                      

                        

                        <input
                          type="text"
                          placeholder="Title"
                          name="Title"
                          value={inputData.Title}
                          onChange={handleInputs}
                          required
                          className="coupon-input"
                        />
                        <input
                          type="text"
                          placeholder="Website Link"
                          name="WebsiteLink"
                          value={inputData.WebsiteLink}
                          onChange={handleInputs}
                          required
                          className="coupon-input"
                        />
                         <span className="coupon-input">
                          <label
                            for="TopRecommendation"
                            style={{ color: "#cbcbcb" }}
                          >
                          Top Recommendation
                          </label>
                          &nbsp;&nbsp;&nbsp;
                          <input
                            type="checkbox"
                            placeholder="Top Recommendation"
                            name="TopRecommendation"
                            value={inputData.TopRecommendation ? "true" : "false"}
                            onClick={CTopRecommendation}
                            required
                          />
                        </span>
                        <textarea
                          rows="5"
                          placeholder="Bio"
                          onChange={handleInputs}
                          required
                          name="Bio"
                          value={inputData.Bio}
                          className="coupon-input"
                        />
                        <div className="From-to-input">
                          <input
                            type="date"
                            // placeholder="From (yyyy-mm-dd)"
                            name="From"
                            value={inputData.From}
                            onChange={handleInputs}
                            required
                            className="coupon-input"
                          />
                          <input
                            type="date"
                            // placeholder="To (yyyy-mm-dd)"
                            name="To"
                            value={inputData.To}
                            onChange={handleInputs}
                            required
                            className="coupon-input"
                          />
                          <input
                            type="text"
                            placeholder="Coupon Code"
                            name="Couponcode"
                            value={inputData.Couponcode}
                            onChange={handleInputs}
                            required
                            className="coupon-input"
                          />{" "}
                          <input
                            type="text"
                            placeholder="Deal"
                            name="Deal"
                            value={inputData.Deal}
                            onChange={handleInputs}
                            required
                            className="coupon-input"
                          />
                        </div>

                        <Select
                          placeholder="Select Country"
                          className="coupon-input"
                          isMulti
                          options={options}
                          classNamePrefix="select"
                          value={countryvalue}
                          onChange={changeHandler}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              neutral0: "#f1f1f1",
                            },
                          })}
                        />

                        <button
                          type="submit"
                          className="coupon-btn"
                          onClick={handleImageUploadAndSave}
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AdminAddCoupons;
