import React, { useState, useContext, useEffect, useRef,useMemo } from "react";
import "./AdminAddCoupons.css";
import uploadCoupon from "../../assets/images/uploadCoupon.svg";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../common/Header";
import AdminSidebar from "../common/AdminSidebar";
import { useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../utils/userContext";
import axios from "../../utils/axios";
import { storage } from "../../utils/firebaseConfig";
import Select from "react-select";
import countryList from "react-select-country-list";

const AdminEditCoupons = () => {
  const image = useRef(null);
  const [sidebarShow, setSidebarShow] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [countryvalue, setCountryValue] = useState("");
  const [store, setAllstore] = useState();
  const options = useMemo(() => countryList().getData(), []);
  const { state } = useLocation();
  const { coupon } = state;
  let name, value;
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
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setInputData({ ...inputData, [name]: value });
  };
 

  useEffect(() => {
    var date = new Date(coupon?.to);
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    var dat = new Date(coupon?.from);
    var yea = dat.getFullYear();
    var mon = ("0" + (dat.getMonth() + 1)).slice(-2);
    var da = ("0" + dat.getDate()).slice(-2);
    setPreview(coupon?.image);
    setSelectedImage(coupon?.image);
    setInputData({
      Title: `${coupon?.title}`,
      WebsiteLink: `${coupon?.websiteLink}`,
      Bio: `${coupon?.bio}`,
      From: `${yea}-${mon}-${da}`,
      To: `${year}-${month}-${day}`,
      Couponcode: coupon?.couponCode,
      Deal: coupon?.deal,
      TopRecommendation:coupon?.isTopRecomendation,
      
    });
    setBrandName({label:coupon.brandName,value:coupon.brandName})
    setCountryValue(coupon?.country)
    setCountryValue(coupon?.country?.map((data) => {
      return {
        label: data,
        value: data,
      
      };
    }));
  }, []);
  console.log(coupon?.isTopRecomendation)
  console.log(inputData)
  console.log(inputData.TopRecommendation)
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
    setSelectedImage(coupon?.image);
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
    let undefined = url.includes("undefined");
    let pic = url;
    undefined === true ? (pic = coupon?.image) : (pic = url);
    const {Title, WebsiteLink, Bio, Couponcode, Deal, From, To,  TopRecommendation } =
      inputData;
      const multipleCountry = [...new Set(countryvalue?.flat()?.map((data) => data?.label))];
    const data = {
      brandName: BrandName.label,
      title: Title,
      websiteLink: WebsiteLink,
      bio: Bio,
      couponCode: Couponcode,
      deal: Deal,
      image: pic,
      from: From,
      to: To,
      _id: coupon?._id,
      country:multipleCountry,
      isTopRecomendation: TopRecommendation,
      storeid: storeid,
    };
    try {
      const res = await axios.put(`api/admin/coupon`, data);
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
                            checked={inputData.TopRecommendation}
                            value={inputData.TopRecommendation}
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
                            name="From"
                            value={inputData.From}
                            onChange={handleInputs}
                            required
                            className="coupon-input"
                          />
                          <input
                            
                            type="date"
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
                          placeholder={!countryvalue?"Select Country":countryvalue}
                          className="coupon-input"
                          options={options}
                          isMulti
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

export default AdminEditCoupons;
