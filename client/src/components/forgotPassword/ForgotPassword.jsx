import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Alert,
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
});

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = async (data) => {
    setLoading(true);
    axios
      .post("/auth/forgot-password", data, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        setDialogOpen(true);
        setDisableSubmit(true);
        if (response.status === 200) {
          setCountdown(60);
        }
      })
      .catch((error) => {
        setError("email", {
          type: "manual",
          message: error.response.data.errorMessage,
        });
        setLoading(false);
      });
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    let timer = null;

    if (disableSubmit) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown === 0) {
      clearInterval(timer);
      setDisableSubmit(false); // Enable the submit button after the countdown reaches 0
    }

    return () => {
      clearInterval(timer);
    };
  }, [disableSubmit, countdown]);

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
              Account recovery
            </Typography>
            <Typography
              mt={2}
              sx={{
                fontSize: `16px`,
                fontWeight: `400`,
                letterSpacing: `0.1`,
                lineHeight: `1.5`,
                px: `20px`,
                textAlign: `center`,
              }}
            >
              Please provide the email associated with your account. BookEase
              will send an email with instructions to reset your password.
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                sx={{ mt: 4 }}
                fullWidth
                id="email"
                name="email"
                label="Enter Your Email"
                autoComplete="email"
                autoFocus
                error={errors.email ? true : false}
                {...register("email")}
                helperText={errors ? errors?.email?.message : null}
              />
              {disableSubmit && (
                <FormHelperText>resend in {countdown}</FormHelperText>
              )}
              <Grid container mt={4}>
                <Grid item xs sx={{ textAlign: `right` }}>
                  <Button
                    disabled={disableSubmit}
                    type="submit"
                    variant="contained"
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
              <Dialog onClose={handleClose} open={dialogOpen}>
                <DialogTitle>BookEase Account Recovery</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <Alert severity="success">
                      The revovery Email has been sent, Please check your Emails
                    </Alert>
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default ForgotPassword;
