import express, { response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookies from "cookie-parser";
import authRoute from "#api/routes/auth.js";
import hotelsRoute from "#api/routes/hotels.js";
import roomsRoute from "#api/routes/rooms.js";
import usersRoute from "#api/routes/users.js";

// ENV
dotenv.config();
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

const app = express();
app.use(express.json());
app.use(cookies());
app.use(cors({ credentials: true, origin: CORS_ORIGIN }));

// MongoDB
mongoose
  .connect(MONGODB_URL)
  .then((response) => {
    console.log("mongodb connection successfull ");
  })
  .catch((err) => {
    console.log("mongodb connection failed", err);
  });

mongoose.connection.on("disconnected" | "error", (err) => {
  console.log(err);
});

// Middlewares
app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    errorMessage: errorMessage,
    stack: err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
