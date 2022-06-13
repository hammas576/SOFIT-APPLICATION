require("dotenv").config();
var app = require("express")();
var port = process.env.PORT || 3000;
const auth = require("./routes/authenticated.js");
const mongoose = require("mongoose");

app.listen(port, () => {
  console.log("App is live at ", port);
});
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => {
  console.log("connected to database");
});

app.use("/api", auth);
