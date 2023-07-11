import User from "#api/models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { createError } from "#api/utils/error.js";

export const register = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return next(createError(400, "Username exists try different"));
    }
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return next(createError(400, "Email already exists"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
      isAdmin: req.body.isAdmin || false,
    });
    await newUser.save();
    res.status(200).send("User has been created");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordMatches = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatches)
      return next(createError(400, "Wrong Password or username"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ details: { ...otherDetails, isAdmin } });
  } catch (err) {
    next(err);
  }
};

export const randomDp = async (req, res, next) => {
  try {
    const catImageUrl =
      "https://thecatapi.com/api/images/get?format=src&size=small&type=jpg";

    const response = await axios.get(catImageUrl, {
      responseType: "arraybuffer",
    });
    const contentType = response.headers["content-type"];
    const imageData = Buffer.from(response.data, "binary");

    res.set("Content-Type", contentType);
    res.send(imageData);
  } catch (err) {
    next(err);
  }
};
