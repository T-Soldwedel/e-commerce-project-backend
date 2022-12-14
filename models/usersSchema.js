import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

//user document structure
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "manager"], default: "user" },
    token: { type: String },
    profileImage: {
      type: String,
      default: function () {
        return `https://joeschmoe.io/api/v1/${this.firstName}`;
      },
    },
    password: { type: String, required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: "orders" }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    this.password = hashedPassword;
    console.log("password hashed and store into DB");
  }

  next();
});

userSchema.post("save", function () {
  console.log("I am Post_Save function");
});

const UsersCollection = mongoose.model("users", userSchema);

UsersCollection.createIndexes({ email: -1 });

export default UsersCollection;
