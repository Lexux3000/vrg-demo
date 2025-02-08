const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/routes");

app.use(express.json());
app.use(cors());
app.use("/api", routes); // routes

app.listen(5001, () => console.log("Server running on port 5001"));
