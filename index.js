const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 5000;
require('dotenv').config();

// ----------------------------middleware---------------------------------

app.use(cors());
app.use(express.json());



// -------------------------server run port start-------------------------------
app.get("/", (req, res) => {
  res.send("mail server is started");
});
app.listen(port, () => {
  console.log(`mail server is running on port ${port}`);
});
