import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productsController.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
import verifyToken from "../middlewares/verifyToken.js";

const route = express.Router();

route.get("/", getAllProducts);

route.get("/:id", getSingleProduct);

route.post("/", verifyToken, isAdmin, createProduct);

route.patch("/:id", verifyToken, isAdmin, updateProduct);

route.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default route;
