const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
let userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
    },
    lastName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (el) {
          return this.password === el;
        },
        message: "The passwords does not match",
      },
    },
    passwordChangeAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // address: [
    //   {
    //     type: ObjectId,
    //     ref: "Address",
    //   },
    // ],
    // whishlist: [
    //   {
    //     type: ObjectId,
    //     ref: "Product",
    //   },
    // ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.changePasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangeAt) {
    const passwordChangeTimeStamp = parent(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTtimestamp < passwordChangeTimeStamp;
  }
  //false means not changed
  return false;
};
//Export the model
const User = mongoose.model("User", userSchema);

module.exports = User;
