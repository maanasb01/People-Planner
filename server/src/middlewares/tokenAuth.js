const jwt = require("jsonwebtoken");

const tokenAuth = (req, res, next) => {
  
  const token = req.cookies.authToken;

  if (token) {
    jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, data) => {
      if (err) {

        return res.sendStatus(403);
      } else {
        // data.user has only the "id" field.
        req.user = data.user;
        next();
      }
    });
  } else {
    /* 401- the client request has not been completed because it lacks valid authentication credentials for the requested resource.-MDN */
    res.sendStatus(401);
  }
};

module.exports = tokenAuth;