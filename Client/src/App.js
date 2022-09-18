import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Blogs from "./components/blogs/Blogs";
import AllBlogs from "./components/blogs/AllBlogs";
import Blogbycategory from "./components/blogs/Blogbycategory";
import ParticularBlog from "./components/particularBlog/ParticularBlog";
import Coupons from "./components/coupons/Coupons";
import CouponBrand from "./components/coupons/CouponBrand";
import AllStore from "./components/coupons/AllStore";
import AllCategory from "./components/coupons/AllCategory";
import SingleCategory from "./components/coupons/SingleCategory";
import CCountry from "./components/coupons/CCountry";
import Brand from "./components/particularBrand/Brand";
import Contact from "./components/contact/Contact";
import SearchPage from "./components/common/SearchPage";
import Submit from "./components/submit/Submit";
import UserContact from "./components/loggedInUser/UserContact";
import UserInsights from "./components/loggedInUser/UserInsights";
import UserDashboard from "./components/loggedInUser/UserDashboard";
import UserBlogs from "./components/loggedInUser/UserBlogs";
import EditBlog from "./components/loggedInUser/EditBlog";
import UserComments from "./components/loggedInUser/UserComments";
import UserProfile from "./components/loggedInUser/UserProfile";
import UserPublish from "./components/loggedInUser/UserPublish";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminBlogs from "./components/admin/AdminBlogs";
import AdminPromoted from "./components/admin/AdminPromoted";
import AdminEditBlog from "./components/admin/AdminEditBlog";
import AdminComments from "./components/admin/AdminComments";
import AdminVerifications from "./components/admin/AdminVerifications";
import AdminSeo from "./components/admin/AdminSeo";
import AdminCoupons from "./components/admin/AdminCoupons";
import AdminAddCoupons from "./components/admin/AdminAddCoupons";
import AdminAddStore from "./components/admin/AdminAddStore";
import AdminEditCoupons from "./components/admin/AdminEditCoupons";
import AdminCategories from "./components/admin/AdminCategories";
import ActiveBanners from "./components/admin/ActiveBanners";
import getUser from "./utils/getUser";
import UserContext from "./utils/userContext";
import { Helmet } from "react-helmet";
import axios from "./utils/axios";
function App() {
  const [user, setUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [seo, setSeo] = useState([]);
  useEffect(() => {
    getUser(setUser, setIsLoading);
    GetSEO();
  }, []);
  const GetSEO = () => {
    try {
      axios.get("/api/admin/seo").then((response) => {
        setSeo(response.data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app-main">
      <Helmet>
        <title>{seo[0]?.title}</title>
        <meta name="description" content={seo[0]?.description} />
        <meta
          name="keywords"
          content={seo[0]?.keywords} />
        
      </Helmet>
      <UserContext.Provider value={{ user, setUser, isLoading }}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/blogs/allblogs" element={<Blogs />} />
            <Route exact path="/blogs/allblogs/:_id" element={<AllBlogs />} />
            <Route exact path="/blogs/:category" element={<Blogbycategory />} />
            <Route
              exact
              path="/particular-blog/:_id"
              element={<ParticularBlog />}
            />
            <Route
              exact
              path="/:_id"
              element={<ParticularBlog />}
            />
            <Route exact path="/coupons" element={<Coupons />} />
            <Route exact path="/coupons/brand" element={<CouponBrand />} />
            <Route exact path="/coupons/stores" element={<AllStore />} />
            <Route exact path="/coupons/category" element={<AllCategory />} />
            <Route
              exact
              path="/coupons/singlecategory"
              element={<SingleCategory />}
            />
            <Route exact path="/coupons/:id" element={<CCountry />} />
            <Route exact path="/particular-brand" element={<Brand />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/submit" element={<Submit />} />
            <Route exact path="/user/contact" element={<UserContact />} />
            <Route exact path="/user/dashboard" element={<UserDashboard />} />
            <Route exact path="/user/insights" element={<UserInsights />} />
            <Route exact path="/user/blogs" element={<UserBlogs />} />
            <Route exact path="/user/editblog/:id" element={<EditBlog />} />
            <Route exact path="/user/comments" element={<UserComments />} />
            <Route exact path="/user/profile" element={<UserProfile />} />
            <Route exact path="/user/publish" element={<UserPublish />} />
            <Route exact path="/admin/dashboard" element={<AdminDashboard />} />
            <Route exact path="/admin/blogs" element={<AdminBlogs />} />
            <Route
              exact
              path="/admin/promotedblogs"
              element={<AdminPromoted />}
            />
            <Route
              exact
              path="/admin/promotedblogs/editblog"
              element={<AdminEditBlog />}
            />
            <Route exact path="/admin/comments" element={<AdminComments />} />
            <Route exact path="/admin/coupons" element={<AdminCoupons />} />
            <Route exact path="/searchPage" element={<SearchPage />} />
            <Route
              exact
              path="/admin/addcoupons"
              element={<AdminAddCoupons />}
            />
            <Route exact path="/admin/addstore" element={<AdminAddStore />} />
            <Route
              exact
              path="/admin/editcoupons"
              element={<AdminEditCoupons />}
            />
            <Route
              exact
              path="/admin/categories"
              element={<AdminCategories />}
            />
            <Route
              exact
              path="/admin/user-verification"
              element={<AdminVerifications />}
            />
            <Route exact path="/admin/seo" element={<AdminSeo />} />
            <Route
              exact
              path="/admin/activebanners"
              element={<ActiveBanners />}
            />
            <Route path="*" element={<Landing />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
