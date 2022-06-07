const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// fake database
let refreshTokens = [];
class AuthController {
  //Register
  async register(req, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      //Create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      //Save to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  //generate access token
  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "20s" }
    );
  }
  //generate refresh token
  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user._id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "30d" }
    );
  }
  //Login
  async login(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("user not exist!");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("wrong password");
      }
      const authController = new AuthController();
      const accessToken = authController.generateAccessToken(user);
      const refreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // deploy edit true
        path: "/",
        sameSite: "strict"
      });
      const { password, ...others } = user._doc;
      res.status(200).json({ others, accessToken });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  // refresh token
  async requestRefreshToken(req, res) {
    try{
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken) return res.status(401).json("you're not authenticated");
      if(!refreshToken.includes(refreshTokens)) {
        res.status(403).json("refresh token is not valid");
      }
      jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) =>{
        if(err) {
          console.log(err);
        }
        //filter old refresh token
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        //create accessToken, refreshToken
        const newRefreshToken = new AuthController().generateRefreshToken(user);
        const newAccessToken = new AuthController().generateAccessToken(user);
        refreshTokens.push(newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "strict"
        });
        res.status(200).json({ accessToken: newAccessToken });
      });
    } catch (err) {

    }
  }

  async logout(req, res) {
    try{
      res.clearCookie("refreshToken");
      refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
      res.status(200).json("logged out successfully!");
    }catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = new AuthController();
