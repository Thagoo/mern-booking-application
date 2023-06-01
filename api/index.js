import express, { response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookies from "cookie-parser";

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

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
