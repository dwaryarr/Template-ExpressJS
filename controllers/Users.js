import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await Users.findOne({
      attributes: { exclude: ["password"] },
      where: {
        userid: req.params.userid,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  console.log(req.body);
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res.status(400).json({ message: "Password not match" });
  const hashedPassword = await argon2.hash(password);
  try {
    await Users.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      userid: req.params.userid,
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  const { name, email, password, confPassword, role } = req.body;
  let hashedPassword;
  if (password === "" || password === null) {
    hashedPassword = user.password;
  } else {
    hashedPassword = await argon2.hash(password);
  }
  if (password !== confPassword)
    return res.status(400).json({ message: "Password not match" });
  try {
    await Users.update(
      {
        name,
        email,
        password: hashedPassword,
        role,
      },
      {
        where: {
          userid: user.userid,
        },
      }
    );
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      userid: req.params.userid,
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  try {
    await Users.destroy({
      where: {
        userid: user.userid,
      },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
