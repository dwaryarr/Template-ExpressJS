import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!(await argon2.verify(user.password, password)))
      return res.status(400).json({ message: "Password not match" });
    req.session.userid = user.userid;
    res.status(200).json({ message: "Login success", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userid) {
    return res.status(401).json({ message: "User not logged in" });
  }
  const user = await User.findOne({
    atttributes: { exclude: ["password"] },
    where: {
      userid: req.session.userid,
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};

export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ message: err.message });
    // res.clearCookie("sid");
    res.status(200).json({ message: "Logout success" });
  });
};
