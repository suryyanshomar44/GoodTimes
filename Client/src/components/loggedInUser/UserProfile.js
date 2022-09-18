import React, { useRef, useState, useContext, useEffect } from "react";
import "./UserProfile.css";
import User from "../../assets/images/user.svg";
import Add from "../../assets/images/add.svg";
import { Container } from "react-bootstrap";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/userContext";
import { storage } from "../../utils/firebaseConfig";
import axios from "../../utils/axios";

function UserProfile() {
  const image = useRef(null);
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(user?.profile);
  const [sidebarShow, setSidebarShow] = useState(false);
  const [preview, setPreview] = useState(user?.profile);
  const [username, setUsername] = useState(user?.username);
  const [about, setAbout] = useState(user?.about);
  const id = localStorage.getItem("userid");
  console.log(id);
  useEffect(() => {
    setPreview(user?.profile);
    setSelectedImage(user?.profile);
    setUsername(user?.username);
    setAbout(user?.about);
  }, [user]);

  if (!isLoading && !user) navigate("/");
  if (isLoading) return null;

  const handleClick = () => {
    image.current.click();
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleAbout = (e) => {
    setAbout(e.target.value);
  };

  const handleImageSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedImage(e.target.files[0]);
    URL.createObjectURL(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleImageUploadAndSave = (e) => {
    e.preventDefault();
    setSelectedImage(user.profile);
    if (!selectedImage) {
      alert("Add/Update user profile image");
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
    undefined === true ? (pic = user.profile) : (pic = url);
    const data = {
      username: username,
      about: about,
      profile: pic,
    };
    console.log(data);
    try {
      const res = await axios.put(`/api/user/updateuser/${id}`, data);
      alert(res?.data?.message);
      navigate("/user/dashboard");
      if (res?.data?.code !== 200) return;
      navigate("/user/dashboard");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const requestVerify = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      about: about,
      profile: user.profile,
    };
    try {
      const res = await axios.get("api/user/requestVerification", data);
      alert(res?.data?.message);
      navigate("/user/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
      {sidebarShow && <Sidebar selected={"profile"} />}
      <Container className="userp-main">
        <form>
          <div className="userp-sec1">
            <div className="userp-addimg" onClick={handleClick}>
              {!preview ? (
                <img src={User} alt="user" className="userp-user" />
              ) : (
                <img src={preview} alt="avatar" className="userp-avatar" />
              )}
              <img src={Add} alt="add" className="userp-add" />
              <input
                type="file"
                ref={image}
                accept="image/png, image/jpeg"
                className="userp-avatari"
                onChange={handleImageSelect}
              />
            </div>
            <div className="userp-nr">
              <input
                type="text"
                placeholder="User Name"
                value={username}
                onChange={handleUsername}
                minLength="8"
              />
            </div>
          </div>
          <textarea
            type="text"
            placeholder="About"
            className="userp-ta"
            rows="5"
            value={about}
            onChange={handleAbout}
          />
          <div className="userp-btns">
            <button onClick={requestVerify} className="userp-veri userp-btn">
              Request Verification
            </button>
            <button
              onClick={handleImageUploadAndSave}
              className="userp-save userp-btn"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Container>
    </>
  );
}

export default UserProfile;
