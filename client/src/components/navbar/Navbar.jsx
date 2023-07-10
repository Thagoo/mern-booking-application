import { Link } from "react-router-dom";
import "./navbar.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useRadioGroup } from "@mui/material";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to={"/"}>
          <span>
            <img className="logo-nav" src="images/bookease.svg" alt="" />
          </span>
        </Link>

        <div className="navItems">
          {user ? (
            <Link to={"/profile"}>
              <img src={user.img} alt="" className="avatar" />
            </Link>
          ) : (
            <>
              <Link to={"/signup"}>
                <button className="navButton">Register</button>
              </Link>

              <Link to={"/login"}>
                <button className="navButton">Login</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
