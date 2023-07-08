import "./Profile.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { userInputs } from "./formInput";
import { Avatar, Button, Grid } from "@mui/material";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
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

const Profile = () => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [initialInfo, setInitialInfo] = useState({});
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const inputs = userInputs;

  const { user, dispatch } = useContext(AuthContext);

  const {
    handleSubmit,
    register,
    watch,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

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

      const response = await axios.put(`/users/${user._id}`, newUser);
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

  useEffect(() => {
    const data = watch();
    const hasChanges = Object.keys(data).some(
      (key) => data[key] !== initialInfo[key]
    );

    setSubmitDisabled(!hasChanges);
  });

  useEffect(() => {
    const data = watch();
    setInitialInfo(data);
  }, [2]);

  return (
    <div className="new">
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Profile</h1>
        </div>
        <div className="bottom">
          <div className="sidebar" />
          <div className="left">
            <img src={file ? URL.createObjectURL(file) : user.img} alt="" />
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
                    defaultValue={user[input.id]}
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

              <Button
                fullWidth
                disabled={submitDisabled}
                type="submit"
                variant="contained"
              >
                Update
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
