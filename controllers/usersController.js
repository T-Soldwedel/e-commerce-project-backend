import UsersCollection from "../models/usersschema.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UsersCollection.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getSingleUser = async (req, res, next) => {
  "/users/:id";
  "/users/123";
  try {
    const id = req.params.id;
    const singleUser = await UsersCollection.findById(id);
    res.json({ success: true, user: singleUser });
  } catch (err) {
    const error = new Error("Id doesn't exist");
    error.status = 404;
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = new UsersCollection(req.body);
    if (req.file) {
      user.profileImage = `/${req.file.filename}`;
    }

    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    let user = await UsersCollection.findById(req.params.id);
    if (req.file) {
      user.profileImage = `/${req.file.filename}`;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    await user.save();

    let body = {};
    for (const key in req.body) {
      if (req.body[key] !== "" && key !== "password") {
        body[key] = req.body[key];
      }
    }

    const updatedUser = await UsersCollection.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    ).populate({
      path: "orders",
      populate: {
        path: "records",
        model: "records",
      },
    });

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingUser = await UsersCollection.findById(id);

    if (existingUser) {
      const deleteStatus = await UsersCollection.deleteOne({
        _id: existingUser._id,
      });
      res.json({ success: true, status: deleteStatus });
    } else {
      throw new Error("user id doesn't exist ! ");
    }
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await UsersCollection.findOne({ email: req.body.email });
    if (user) {
      const check = await bcrypt.compare(req.body.password, user.password);
      if (check) {
        let token = jwt.sign(
          { _id: user._id, firstName: user.firstName },
          process.env.TOKEN_SECRET_KEY,
          { expiresIn: "1h", issuer: "Naqvi", audience: "students" }
        );

        const updatedUser = await UsersCollection.findByIdAndUpdate(
          user._id,
          { token: token },
          { new: true }
        ).populate({
          path: "orders",
          populate: {
            path: "records",
            model: "records",
          },
        });

        res.header("token", token);

        res.json({ success: true, data: updatedUser });
      } else {
        throw new Error("password doesn't match !");
      }
    } else {
      throw new Error("email doesn't exist");
    }
  } catch (err) {
    next(err);
  }
};

export const checkUserToken = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const user = await UsersCollection.findById(payload._id).populate({
      path: "orders",
      populate: {
        path: "records",
        model: "records",
      },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
