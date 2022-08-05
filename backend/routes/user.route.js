const bcrypt = require("bcryptjs");
const express = require("express");
const UserRoute = express.Router();

// model
let UserModel = require("../models/User");

UserRoute.route("/find-user").post((req, res) => {
  UserModel.findOne({ name: req.body.name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
});

UserRoute.route("/signIn-user").post((req, res) => {
  UserModel.findOne({ name: req.body.name }).then((user) => {
    if (user) {
      bcrypt.compare(req.body.pwd, user.pwd).then((isMatch) => {
        if (isMatch)
          res.json({
            success: true,
            score: user.score,
          });
        else
          res.json({
            success: false,
            msg: "Invalid password!",
            errCode: 0,
          });
      });
    } else {
      res.json({
        success: false,
        msg: "Invalid user!",
        errCode: 1,
      });
    }
  });
});

UserRoute.route("/signUp-user").post((req, res) => {
  UserModel.findOne({ name: req.body.name }).then((user) => {
    if (user) {
      res.json({
        success: false,
        msg: "Already Exist!",
      });
    } else {
      const newUser = new UserModel({
        name: req.body.name,
        pwd: req.body.pwd,
        score: 0,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.pwd, salt, (err, hash) => {
          if (err) throw err;
          newUser.pwd = hash;
          newUser.save().catch((err) => res.json(err));
        });
      });

      res.json({
        success: true,
        score: newUser.score,
      });
    }
  });
});

//read
UserRoute.route("/update-score").post(async (req, res) => {
  const { name, isUp } = req.body;

  UserModel.findOne({ name }).then((user) => {
    let score = user.score;
    if (isUp) score += 1;
    else score -= 1;

    UserModel.findOneAndUpdate(
      { name: name },
      {
        $set: {
          score: score,
        },
      }
    ).catch((err) => console.log(err));
  });
});

module.exports = UserRoute;
