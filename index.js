const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();

// Require =>
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// Middle-Ware
app.use(cors());
app.use(express.json());
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

    const productsCollection = client.db("hikingRoX").collection("products");
    const emailCollection = client.db("hikingRoX").collection("emailList");

    // Add New Product
    //added new user ==========>
    app.post("/products", async (req, res) => {
      const newProduct = req.body;

      const result = await productsCollection.insertOne(newProduct);
      res.send({ result });
    });

    // // Email Post Token JWt
    // app.post("/login", async (req, res) => {
    //   const email = req.body;
    //   var token = jwt.sign(email, process.env.ACCESS_TOKEN);
    //   console.log(token);

    //   // const result = await emailCollection.insertOne(email);
    //   res.send({ token });
    // });

    // Send Data DB to client with APi =====>
    app.get("/products", async (req, res) => {
      const users = await productsCollection.find({}).toArray();
      res.send(users);
    });

    // API need to get specific user
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    // update ---------------------
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const stock = req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          quantity: stock.newStock,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // Delete a User
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Runnig Server");
});

app.listen(PORT, () => {
  console.log("server is running port", PORT);
});
