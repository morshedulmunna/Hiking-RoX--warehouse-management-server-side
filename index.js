const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();

const products = require("./Route/products.js");

// Require =>
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// Middle-Ware
app.use(cors());
// DB Connection
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hkk7c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};
run();
// Route===>
// app.use("/posts", products);

app.listen(PORT, () => {
  console.log("server is running port", PORT);
});
