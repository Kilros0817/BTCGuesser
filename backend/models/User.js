const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    default: ""
  },
  pwd: {
    type: String,
    default: "",
  },
  score: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
