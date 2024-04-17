const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const connectToMongo = require("./db");
const User = require("./models/User");

connectToMongo();
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

startServer();

async function initializeManager() {
  try {
    let manager = await User.findOne({ role: "manager" });
    if (!manager) {
      let salt = await bcrypt.genSalt(10);
      let securedPass = await bcrypt.hash("manager@123", salt);
      manager = await User.create({
        name: "Manager1",
        email: "manager1@gmail.com",
        role: "manager",
        password: securedPass,
      });

      let users = await User.find();

      for (let user of users) {
        user.managerId = manager._id;
        await user.save();
      }
    }
  } catch (error) {
    console.error("Something Wrong with the ManagerInit Function: ", error);
  }
}

async function startServer() {
  await initializeManager();

  app.use("/auth", require("./routes/auth"));
  app.use("/timelog", require("./routes/timeLog"));
  app.use("/user", require("./routes/user"));
  app.use("/leave", require("./routes/leave"));

  app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });
}
