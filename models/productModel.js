const mongoose = require("mongoose"); // Erase if already required
const slugify = require("slugify");
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      //   type: mongoose.schema.Types.ObjectId,
      //   ref: Category,
    },
    brand: {
      type: String,
      required: true,
      enum: ["apple", "sumsang", "lenovo"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      enum: ["black", "brown", "red"],
      required: true,
    },
    // rating: [
    //   {
    //     star: Number,
    //     postedBy: {
    //       type: mongoose.schema.Types.ObjectId,
    //       ref: "User",
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);
productSchema.pre("save", function () {
  this.slug = slugify(this.title, {
    lower: true,
    trim: true,
  });
});

//Export the model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
