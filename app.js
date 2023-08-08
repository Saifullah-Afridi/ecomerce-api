const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./.env" });
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;
const dbConnect = require("./config/databaseConnection");
const authRoutes = require("./routes/authRoutes");
const { notFound, globalErrorHandler } = require("./middlwares/errorHandler");

dbConnect();
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", authRoutes);

app.all("*", notFound);

app.use(globalErrorHandler);
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
