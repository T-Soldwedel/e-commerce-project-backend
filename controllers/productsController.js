import { response } from "express";
import ProductsCollection from "../models/productsSchema.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductsCollection.find();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const singleProduct = await ProductsCollection.findById(id);
    res.json({ success: true, product: singleProduct });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = new ProductsCollection(req.body);
    if (req.file) {
      product.img = `/${req.file.filename}`;
    }
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedProduct = await ProductsCollection.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingProduct = await ProductsCollection.findById(id);

    if (existingProduct) {
      const deleteStatus = await ProductsCollection.deleteOne({
        _id: existingProduct._id,
      });
      res.json({ success: true, status: deleteStatus });
    } else {
      throw new Error("Product id doesn't exist ! ");
    }
  } catch (err) {
    next(err);
  }
};
