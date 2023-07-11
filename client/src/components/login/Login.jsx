import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Grid,
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Backdrop,
  CircularProgress,
  Snackbar,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthContext } from "../../context/AuthContext";

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Mininum 4 characters")
    .max(10, "Maximum 10 characters")
    .required(),
});

function Login({ setAuthenticated, setUserDetails }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const { loading, error, dispatch } = useContext(AuthContext);
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = async (data) => {
    dispatch({ type: "LOGIN_START" });

    axios
      .post("/auth/login", data, {
        withCredentials: true,
      })
      .then((response) => {
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data.details });
        navigate("/");
      })
      .catch((error) => {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: error.response.data.errorMessage,
        });

        if (error.response.data.errorMessage === "User not found") {
          setError("email", {
            type: "manual",
            message: error.response.data.errorMessage,
          });
        }

        if (error.response.data.errorMessage === "Wrong Password or username") {
          setError("password", {
            type: "manual",
            message: error.response.data.errorMessage,
          });
        }
      });
  };

  const snackbar = (
    <Snackbar
      open={showSuccess}
      autoHideDuration={6000}
      message={successMessage}
    ></Snackbar>
  );

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container component="main" maxWidth="sm">
        <Paper
          variant="outlined"
          sx={{ my: { xs: 8, md: 6 }, p: { xs: 2, md: 4 } }}
        >
          <Box
            sx={{
              display: `flex`,
              flexDirection: `column`,
              alignItems: `center`,
            }}
          >
            {" "}
            {snackbar}
            <img className="logo" src="images/bookease.png" alt="" />
            <Typography mt={2} sx={{ fontSize: `4vh` }}>
              Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                sx={{ mt: 4 }}
                fullWidth
                id="email"
                name="email"
                label="Email"
                autoComplete="email"
                autoFocus
                error={errors.email ? true : false}
                {...register("email")}
                helperText={errors ? errors?.email?.message : null}
              />
              <TextField
                sx={{ mt: 4 }}
                fullWidth
                id="password"
                label="Password"
                error={!!errors.password}
                helperText={errors?.password?.message}
                type={showPassword ? "text" : "password"}
                autoComplete="password"
                {...register("password")}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
                autoFocus
              />
              <Link to="/signup">
                <Button
                  disabled={loading}
                  sx={{
                    boxShadow: `none`,
                    textTransform: `none`,
                  }}
                >
                  Forgot Password
                </Button>
              </Link>
              <Grid container mt={4}>
                <Grid item xs>
                  <Link to="/signup">
                    <Button
                      disabled={loading}
                      sx={{
                        boxShadow: `none`,
                        textTransform: `none`,
                      }}
                    >
                      Create Account
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs sx={{ textAlign: `right` }}>
                  <Button
                    disabled={loading}
                    type="submit"
                    variant="contained"
                    sx={{
                      boxShadow: `none`,
                      backgroundColor: `#1a73e8`,
                      textTransform: `none`,
                      px: 3,
                    }}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default Login;
