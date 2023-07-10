import "./Signup.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { userInputs } from "./formInput";
import { Avatar, Button, Grid } from "@mui/material";

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField } from "@mui/material";

const schema = yup.object({
  username: yup
    .string()
    .min(4, "Mininum 4 characters")
    .max(10, "Maximum 10 characters")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "This field cannot contain white space and special character"
    )
    .required("Username is required"),
  password: yup
    .string()
    .min(4, "Mininum 4 characters")
    .max(10, "Maximum 10 characters")
    .required(),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .number()
    .typeError("That doesn't look like a phone number")
    .positive("A phone number can't start with a minus")
    .integer("A phone number can't include a decimal point")
    .min(10)
    .required("A phone number is required"),
  city: yup
    .string()
    .min(4, "Mininum 2 characters")
    .max(10, "Maximum 15 characters")
    .required(),
  country: yup
    .string()
    .min(4, "Mininum 2 characters")
    .max(10, "Maximum 15 characters")
    .required(),
});

const Signup = () => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});

  const inputs = userInputs;

  const { dispatch } = useContext(AuthContext);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleClick = async (data) => {
    const imgdata = new FormData();
    imgdata.append("file", file);
    imgdata.append("upload_preset", "upload");
    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dzkxdyunu/image/upload",
        imgdata
      );
      const { url } = uploadRes.data;
      const newUser = {
        ...data,
        img: url,
      };
      console.log(newUser);
      const response = await axios.post(`/auth/register`, newUser);
      //   dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
      //   navigate("/login");
    } catch (error) {
      if (
        error.response.data.errorMessage === "Username exists try different"
      ) {
        setError("username", {
          type: "manual",
          message: error.response.data.errorMessage,
        });
      }
      if (error.response.data.errorMessage === "Email already exists") {
        setError("email", {
          type: "manual",
          message: error.response.data.errorMessage,
        });
      }
    }
  };

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h1>Signup</h1>
        </div>
        <div className="bottom">
          <div className="sidebar" />
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://thecatapi.com/api/images/get?format=src&size=small&type=jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit(handleClick)}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input._id}>
                  <TextField
                    fullWidth
                    id={input.id}
                    label={input.label}
                    type={input.type}
                    autoComplete={input.id}
                    error={!!errors[input.id]}
                    helperText={errors[input.id]?.message}
                    {...register(input.id)}
                    autoFocus
                  />
                </div>
              ))}

              <Grid container>
                <Grid xs item>
                  <Link to={"/login"}>
                    <Button
                      variant="outlined"
                      sx={{
                        boxShadow: `none`,
                        border: `none !important`,
                        textTransform: `none`,
                        px: 3,
                      }}
                    >
                      already have an account? Login
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs sx={{ textAlign: `right` }}>
                  {" "}
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleClick}
                    sx={{
                      boxShadow: `none`,
                      backgroundColor: `#1a73e8`,
                      textTransform: `none`,
                      px: 3,
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
