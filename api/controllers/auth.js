import User from "#api/models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { createError } from "#api/utils/error.js";
import nodemailer from "nodemailer";

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

export const forgotPassword = async (req, res, next) => {
  // nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      type: "login",
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate reset token and save it to the user object in the database
  const resetToken = jwt.sign({ _id: user._id }, process.env.JWT, {
    expiresIn: "180s",
  });
  user.resetToken = resetToken;
  await user.save();
  // Send password reset email
  const mailOptions = {
    from: "bookease@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Dear user,\n\nTo reset your password, please click the following link: \n\nhttp://localhost:3000/reset-password?token=${resetToken}\n\nIf you didn't request this reset, please ignore this email.\n\nRegards,\nThe BookEase Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending password reset email:", error);
      return res
        .status(500)
        .json({ message: "Failed to send password reset email" });
    } else {
      console.log("Password reset email sent successfully:", info.response);
      return res.status(200).json({ message: "Password reset email sent" });
    }
  });
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    jwt.verify(token, process.env.JWT); //if the token is expired or invalid JWT creates an error

    const user = await User.findOne({ resetToken: token });
    console.log(user);
    if (!user) {
      return next(createError(404, "Invalid or expired reset token"));
    } else {
      // Update user's password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      user.password = hash;
      user.resetToken = null;
    }

    return res.status(200).json("Password reset successful");
  } catch (err) {
    return next(createError(500, err));
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
