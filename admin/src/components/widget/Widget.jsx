import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Widget = ({ type }) => {
  const [booking, setBooking] = useState(false);

  let widgetData;

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useFetch("/users");
  const {
    data: hotelData,
    loading: hotelLoading,
    error: hotelError,
  } = useFetch("/hotels");
  const {
    data: roomData,
    loading: roomLoading,
    error: roomError,
  } = useFetch("/rooms");

  const bookingsCount = roomData.reduce((count, room) => {
    return (
      count +
      room.roomNumbers.reduce((roomCount, roomNumber) => {
        return roomCount + roomNumber.unavailableDates.length;
      }, 0)
    );
  }, 0);

  //temporary
  const amount = 100;
  const diff = 20;

  useEffect(() => {
    if (type === "bookings") {
      setBooking(true);
    }
  }, []);

  switch (type) {
    case "users":
      widgetData = {
        title: "USERS",
        amount: userData.length,
        isMoney: false,
        link: "See details",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "bookings":
      widgetData = {
        title: "BOOKINGS",
        isMoney: false,
        amount: bookingsCount,
        link: "See details",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "hotels":
      widgetData = {
        title: "HOTELS",
        amount: hotelData.length,
        isMoney: false,
        link: "See details",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "rooms":
      widgetData = {
        title: "ROOMS",
        amount: roomData.length,
        isMoney: false,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{widgetData.title}</span>
        <span className="counter">
          {widgetData.isMoney && "₹"} {widgetData.amount}
        </span>

        {!booking && (
          <Link to={`${type}`}>
            <a className="link">See Details</a>
          </Link>
        )}
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {widgetData.icon}
      </div>
    </div>
  );
};

export default Widget;
