import Logo from "../../assets/images/couponLogo.png";
import { IoIosArrowBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import {useNavigate ,NavLink,} from "react-router-dom";
import {
  Container,
  Form,
  FormControl,
  Navbar,
  Nav, 
} from "react-bootstrap";
const Header = ({setInput,text,input}) => {
    const navigate=useNavigate()
  return (
    <>
    <div className="backnavbarC" onClick={() => navigate("/")}>
    <IoIosArrowBack />
    Back to TravelGo
  </div>
    <Navbar
    className="nav-main"
    expand="md"
    fixed="top"
    id="navbar"
    collapseOnSelect
  >
    <Container>
      <NavLink className="nav-link nav-padding" to="/coupons">
      <div
            style={{
              position: "relative",
              height: "80px",
              display: "flex",
              top:8
            }}
          >
            <img src={Logo} alt="logo" height="100%" />
          </div>
      </NavLink>
      
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav>
          <Form
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: "40px",
              // marginBottom: "40px",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <FormControl
              type="search"
              placeholder={text}
              className="coupon-search-input"
              aria-label="Search"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <div
              className="search-icon"
              style={{ display: input ? "none" : "grid" }}
            >
              {" "}
              <IoSearchOutline />
            </div>
          </Form>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  </>
  )
}

export default Header