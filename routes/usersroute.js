import express from "express";
import {
  checkUserToken,
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  loginUser,
} from "../controllers/usersController.js";
import { check } from "express-validator";
import { usersValidation } from "../middlewares/validationMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
import verifyToken from "../middlewares/verifyToken.js";

const route = express.Router();

route.get("/", verifyToken, isAdmin, getAllUsers);

route.post("/login", loginUser);

route.get("/checkUserToken", checkUserToken);

route.get("/:id", verifyToken, isAdmin, getSingleUser);

route.post("/", usersValidation, createUser);

route.patch("/:id", verifyToken, isAdmin, updateUser);

route.delete("/:id", verifyToken, isAdmin, deleteUser);

export default route;
