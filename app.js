import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import usersRoute from "./routes/usersroute.js";
import productsRoute from "./routes/productsroute.js";
import ordersRoute from "./routes/ordersroute.js";

const app = express();
const PORT = process.env.PORT || 4000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let fullPath = "./upload";
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    let fileName = Date.now() + "_" + file.originalname;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("DB connection established!");
});

app.use(morgan("dev"));

app.use(express.json());

app.use(express.static("upload"));

app.use(express.static("views/build"));

app.get("/", (req, res) => {
  res.sendFile("./views/build/index.html", { root: "." });
});

app.use("/users", upload.single("image"), usersRoute);

app.use("/products", upload.single("image"), productsRoute);

app.use("/orders", ordersRoute);

app.use((req, res, next) => {
  res.sendFile("./views/pageNotFound.html", { root: "." });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ success: false, message: err.message });
});

app.listen(PORT, () => console.log("Server is running on port: ", PORT));
