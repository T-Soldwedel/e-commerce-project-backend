import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
} from "../controllers/ordersController.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
import verifyToken from "../middlewares/verifyToken.js";

const route = express.Router();

route.get("/", verifyToken, isAdmin, getAllOrders);

route.get("/:id", verifyToken, getSingleOrder);

route.post("/", verifyToken, createOrder);

route.patch("/:id", verifyToken, updateOrder);

route.delete("/:id", verifyToken, deleteOrder);

export default route;
