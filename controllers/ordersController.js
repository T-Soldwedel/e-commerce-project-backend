import OrdersCollection from "../models/ordersschema.js";
import UsersCollection from "../models/usersschema.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrdersCollection.find()
      .populate("products", "-_id -title -year")
      .populate("userId", "-_id -password -firstName -domain -email");

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getSingleOrder = async (req, res, next) => {
  "/orders/:id";
  "/orders/123";
  try {
    const id = req.params.id;
    const singleOrder = await OrdersCollection.findById(id);
    res.json({ success: true, Order: singleOrder });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = new OrdersCollection(req.body);
    await order.save();

    const updatedUser = await UsersCollection.findByIdAndUpdate(
      order.userId,
      { $push: { orders: order._id } },
      { new: true }
    ).populate({
      path: "orders",
      populate: {
        path: "products",
        model: "products",
      },
    });

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedOrder = await OrdersCollection.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json({ success: true, Order: updatedOrder });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingOrder = await OrdersCollection.findById(id);

    if (existingOrder) {
      await OrdersCollection.deleteOne({
        _id: existingOrder._id,
      });

      const updatedUser = await UsersCollection.findByIdAndUpdate(
        req.user._id,
        { $pull: { orders: id } },
        { new: true }
      ).populate("orders");

      res.json({ success: true, data: updatedUser });
    } else {
      throw new Error("order id doesn't exist ! ");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
