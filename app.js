const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./.env" });
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;
const dbConnect = require("./config/databaseConnection");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const { notFound, globalErrorHandler } = require("./middlwares/errorHandler");
const morgan = require("morgan");

dbConnect();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);

app.all("*", notFound);

app.use(globalErrorHandler);
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
