import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const users = JSON.parse(localStorage.getItem("user")) || null;

export const userInputs = [
  {
    id: "username",
    label: "Username",
    type: "text",
    placeholder: "Name",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "@emailgmail.com",
  },
  {
    id: "phone",
    label: "Phone",
    type: "text",
    placeholder: "+91 934 567 89",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
  },
  {
    id: "country",
    label: "Country",
    type: "text",
    placeholder: "India",
  },
  {
    id: "city",
    label: "City",
    type: "text",
    placeholder: "Bengaluru",
  },
];

export const profileInputs = [
  {
    img: users?.img,
  },
  {
    id: "username",
    label: "Username",
    type: "text",
    placeholder: users?.username,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: users?.email,
  },
  {
    id: "phone",
    label: "Phone",
    type: "text",
    placeholder: users?.phone,
  },
  {
    id: "password",
    label: "Password",
    type: users?.password,
  },
  {
    id: "country",
    label: "Country",
    type: "text",
    placeholder: users?.country,
  },
  {
    id: "city",
    label: "City",
    type: "text",
    placeholder: users?.city,
  },
];

export const productInputs = [
  {
    id: 1,
    label: "Title",
    type: "text",
    placeholder: "Apple Macbook Pro",
  },
  {
    id: 2,
    label: "Description",
    type: "text",
    placeholder: "Description",
  },
  {
    id: 3,
    label: "Category",
    type: "text",
    placeholder: "Computers",
  },
  {
    id: 4,
    label: "Price",
    type: "text",
    placeholder: "100",
  },
  {
    id: 5,
    label: "Stock",
    type: "text",
    placeholder: "in stock",
  },
];

export const hotelInputs = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "My Hotel",
  },
  {
    id: "type",
    label: "Type",
    type: "text",
    placeholder: "hotel",
  },
  {
    id: "city",
    label: "City",
    type: "text",
    placeholder: "New York",
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    placeholder: "elton st, 216",
  },
  {
    id: "distance",
    label: "Distance from City Center",
    type: "text",
    placeholder: "500",
  },
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "The best Hotel",
  },
  {
    id: "desc",
    label: "Description",
    type: "text",
    placeholder: "description",
  },
  {
    id: "cheapestPrice",
    label: "Price",
    type: "text",
    placeholder: "100",
  },
];

export const roomInputs = [
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "2 bed room",
  },
  {
    id: "desc",
    label: "Description",
    type: "text",
    placeholder: "King size bed, 1 bathroom",
  },
  {
    id: "price",
    label: "Price",
    type: "number",
    placeholder: "100",
  },
  {
    id: "maxPeople",
    label: "Max People",
    type: "number",
    placeholder: "2",
  },
];
