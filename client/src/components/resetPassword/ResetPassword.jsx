import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  password: yup
    .string()
    .min(4, "Mininum 4 characters")
    .max(10, "Maximum 10 characters")
    .required(),
  confirmPassword: yup
    .string()
    .min(4, "Mininum 4 characters")
    .max(10, "Maximum 10 characters")
    .required(),
});

function ResetPassword() {
  const [loading, setLoading] = useState(false);

  const [dialogMessage, setDialogMessage] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const navigate = useNavigate();

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
    if (data.password !== data.confirmPassword) {
      setError("password", {
        type: "manual",
        message: "Passoword don't match",
      });
      return setLoading(false);
    }
    data.token = token;
    axios
      .post("/auth/reset-password", data, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);

        if (response.status === 200) {
          setDialogOpen(true);
          setDialogMessage(response.data);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data.errorMessage.name === "TokenExpiredError") {
          setDialogOpen(true);
          setDialogMessage("Your token is expired");
        }
      });
  };

  const handleClose = () => {
    setDialogOpen(false);
    navigate("/");
  };

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
            <img className="logo" src="images/bookease.png" alt="" />
            <Typography mt={2} sx={{ fontSize: `4vh` }}>
              Reset Your Password
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
              Please enter a new password below. Make sure to choose a strong
              password to secure your account.
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                sx={{ mt: 4 }}
                fullWidth
                id="password"
                label="Enter Your Password"
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
              <TextField
                sx={{ mt: 4 }}
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                error={!!errors.password}
                helperText={errors?.password?.message}
                type={showPassword ? "text" : "password"}
                autoComplete="confirmPassword"
                {...register("confirmPassword")}
                autoFocus
              />
              <Grid container mt={4}>
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
                    Submit
                  </Button>
                </Grid>
              </Grid>
              {dialogOpen && (
                <Dialog onClose={handleClose} open={dialogOpen}>
                  <DialogTitle>BookEase Account Recovery</DialogTitle>
                  <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                  </DialogContent>
                  <Button onClick={handleClose}>Ok</Button>
                </Dialog>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default ResetPassword;
