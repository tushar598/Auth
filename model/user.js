const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://tushar19chouhan:SsyLiHXX8VYRDMZN@auth.9rzfsei.mongodb.net/?retryWrites=true&w=majority&appName=auth"
);

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
});

module.exports = mongoose.model("user", userSchema);
