import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Reister
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isUsed = await User.findOne({ username });

    if (isUsed) {
      return res.json({ message: " Name Used " });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    await newUser.save();
    res.json({
      token,
      newUser,
      message: "Register Done!",
    });
  } catch (error) {
    res.json({ message: "Error register" });
  }
};
//Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "User is not a find" });
    }

    const isPassswordCorect = await bcrypt.compare(password, user.password);

    if (!isPassswordCorect) {
      return res.json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user,
      message: "Login valid",
    });
  } catch (error) {
    res.json({ message: "Error Login" });
  }
};

//Get Me
export const getMe = async (req, res) => {

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.json({ message: "User is not a find" });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({ user, token, message: "Done" });
  } catch (error) {
    return res.json({ message: "No access" });
  }
};
