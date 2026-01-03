const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION");
  console.log(err.name, err.message, err);
  process.exit(1);
});

// Load local env for dev; Render will override with dashboard env
dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log("DB connection error:", err));

const port = process.env.PORT || 8000; // <-- safe fallback
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNCAUGHT REJECTION");
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});
