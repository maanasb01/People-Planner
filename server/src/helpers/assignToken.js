const jwt = require("jsonwebtoken");

//function to assign auth token when user is provided. Returns authToken. Used in Login and Signup Routes.
const assignToken = (user) => {
    const data = {
      user: {
        id: user.id,
      },
    };
  
    const authtoken = jwt.sign(data, process.env.AUTH_SECRET_KEY, {
      expiresIn: "20h",
    });
    return authtoken;
  };

  module.exports = assignToken;