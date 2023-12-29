const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require('express-session');
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require('./config/passport-config'); // Adjust the path accordingly
const mongoSanitize = require("express-mongo-sanitize");
const errorHandler = require("./middlewares/error");
const connectDB = require("./config/db");

//load env vars
dotenv.config({
  path: "./config/config.env",
});
//connect to database
connectDB();

//Route file
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();


//Body Parser
app.use(express.json());


// dev logging middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Set Security headers
app.use(helmet());

// Sanitize data
app.use(mongoSanitize()); // to prevent us from NO-SQL injection

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server Running in ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close Server and exit process
  server.close(() => process.exit(1));
});
