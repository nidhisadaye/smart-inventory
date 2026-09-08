const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/products");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (local instance)
mongoose.connect("mongodb://janhavi_31:lo2lFHXccsXhCxPZ@ac-iqzwjry-shard-00-00.qeqe4jv.mongodb.net:27017,ac-iqzwjry-shard-00-01.qeqe4jv.mongodb.net:27017,ac-iqzwjry-shard-00-02.qeqe4jv.mongodb.net:27017/?ssl=true&replicaSet=atlas-76kn45-shard-0&authSource=admin&appName=M0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.use("/api/products", productRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));