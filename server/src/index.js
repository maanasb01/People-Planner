const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectToMongo = require("./db");

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

app.use("/auth", require("./routes/auth"));
app.use("/timelog", require("./routes/timeLog"));
app.use("/user", require("./routes/user"));


app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});