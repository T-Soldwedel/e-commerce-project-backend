import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [{ type: Schema.Types.ObjectId, ref: "products", required: true }],
  totalPrice: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
});

const OrdersCollection = mongoose.model("orders", orderSchema);

export default OrdersCollection;
