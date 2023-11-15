const mongoose = require("mongoose");

const DB = "mongodb+srv://trial:trial@trial.ejmitti.mongodb.net/"

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.error("Connection Failed:", err);
  });