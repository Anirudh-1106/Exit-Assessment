/*const mongoose = require("mongoose");
//Write missing code here
mongoose
  .connect(
   
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log(error);
  });
*/

const mongoose = require("mongoose");

const connectDB = mongoose
  .connect("mongodb://127.0.0.1:27017/blogDB")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = connectDB;