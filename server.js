const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const multer = require("multer");
const Clarifai = require("clarifai");

// const bodyParser = require("body-parser");

const { ONE_DAY } = require("./constants/constants");

const { redirectLogin } = require("./cookies/checkSession");
const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const updateEntries = require("./controllers/updateEntries");
const updateProfile = require("./controllers/updateProfile");
const deleteProfile = require("./controllers/deleteProfile");
const signout = require("./controllers/signout");
const { handleVerfiedSeen } = require("./controllers/verifiedSeen");
const { handleImageUpload } = require("./controllers/localImageUpload");
const { nodeMailerSMTP, nodemailerCheckToken } = require("./nodemailer.js");
const { getImageBytes } = require("./controllers/imageBytes");

const { SERVER_HOST, PORT } = require("./constants/constants");

const {
  handleClarifaiApiCall,
  handleClarifaiLocalImage,
} = require("./controllers/Clarifai");

// const {  }

// const session = require("express-session");
// const { Session } = require("express-session");

// const {
//   PORT = 3000,
//   SESS_NAME = "sid",
//   SESS_SECRET = "abc",
//   SESS_LIFETIME = ONE_DAY,
// } = process.env;

const { knex } = require("./database/knex");

const app = express();

// app.use(
//   session({
//     name: SESS_NAME,
//     resave: false,
//     saveUninitialized: false,
//     secret: SESS_SECRET,
//     cookie: {
//       maxAge: SESS_LIFETIME,
//       sameSite: true,
//       secure: false,
//     },
//   })
// );

const corsOptions = {
  // origin: ["http://localhost:3000", serverUrl],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static(__dirname + "/build"));
app.use(express.json({ limit: "50mb" }));

// let database = {};
// fs.readFile("database.json", (err, data) => {
//   database = data;
//   database = JSON.parse(database);
//   // console.log("database: ", database);
// });

app.post("/checkSession", redirectLogin(knex));

app.post("/signin", signin.handleSignIn(knex, bcrypt));

app.post("/register", register.handleRegister(knex, bcrypt));

// app.get("/", (req, res) => {
//   res.send(database.users);
// });

app.get("/profile/:id", profile.handleProfileGet(knex));

app.post("/ClarifaiApi", handleClarifaiApiCall());

app.put("/image", updateEntries.handleEntries(knex));

app.put("/update", updateProfile.updateProfile(knex, bcrypt));

app.delete("/delete", deleteProfile.deleteProfile(knex));

app.post("/signout", signout.handleSignout(knex));

app.post("/sendAuthenticationToken", nodeMailerSMTP());

app.get("/checkAuthenticationToken", nodemailerCheckToken());

app.post("/verified-seen", handleVerfiedSeen(knex));

app.post("/uploadLocalFile", handleImageUpload());

app.post("/detectLocalImage", handleClarifaiLocalImage());
app.post("/getImageBytes", getImageBytes());

app.listen(PORT, () => {
  // .catch(console.log);

  console.log(`app is running on port ${PORT}`);
});

// console.log(process.env);
