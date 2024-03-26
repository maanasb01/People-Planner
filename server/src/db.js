const mongoose = require("mongoose");

const connectionLink = process.env.DATABASE_URL;

const connectToMongo = () => {
  mongoose.connect(connectionLink).then(
    () => console.log("Connected to the Database"),
    (err) => console.error(err)
  );
};

module.exports = connectToMongo;