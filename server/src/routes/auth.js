const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenAuth = require("../middlewares/tokenAuth");
const assignToken = require("../helpers/assignToken")

//Create a User using: POST "/auth/createuser". No Login required.
router.post(
  "/createuser",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name should have at least 2 characters"),
    body("email").isEmail().withMessage("Please Provide a Valid Email"),
    body("password")
      .exists()
      .isStrongPassword({
        minLength: 6,
        minUppercase: 0,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 6 characters long. It must contain at least one letter, one number and one special character."
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });

      const authToken = assignToken(user);
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive:user.isActive
      };

      res
        .cookie("authToken", authToken, {
          expires: new Date(Date.now() + 20 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .json({ success: true, user: userResponse });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
      }
  }
);

router.post(
    "/login",
    [
      body("email").isEmail().withMessage("Please Enter a Valid Email"),
      body("password").exists().withMessage("Password is Missing"),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success: false });
      }
  
      try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(401).json({
            message: "Please Enter Valid Credentials.",
            success: false
          });
        }
  
        const passwordMatch = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!passwordMatch) {
          return res.status(401).json({
            message: "Please Enter Valid Credentials.",
            success: false
          });
        }
  
        const authToken = assignToken(user);
        const userResponse = {
          _id: user._id,
          name: user.name,
          email: user.email,
          isActive:user.isActive
        };
  
        res.cookie("authToken", authToken, {
          expires: new Date(Date.now() + 20 * 60 * 60 * 1000),
          httpOnly: true,
        }).json({ success: true, user: userResponse });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error.", success: false });
      }
    }
  );
  

//Logout Route
router.get("/logout", tokenAuth, (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error.", success: false });
  }
});

module.exports = router;