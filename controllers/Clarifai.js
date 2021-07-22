const API_KEY = "87cec9e486e9434a82dc7a55f5ff0bb3";
const Clarifai = require("clarifai");
// const fs = require("fs");
const util = require("util");
const {
  CLARIFAI_API_USER_LIMIT,
  CLARIFAI_API_GUEST_LIMIT,
} = require("../constants/constants");
const { knex } = require("../database/knex");

// debugger
const app = new Clarifai.App({
  apiKey: API_KEY,
});

const handleClarifaiApiCall = () => async (req, res) => {
  const { email } = req.body;
  try {
    const entries = await knex.raw(`  select entries,verified from users
                  where email='${email}';
        `);

    console.log("api call entries: ", entries.rows[0].entries);

    let no_of_entries = entries.rows[0].entries || 100;
    let limit;

    if (entries.rows.length > 0 && entries.rows[0].verified === true) {
      limit = CLARIFAI_API_USER_LIMIT;
    } else {
      limit = CLARIFAI_API_GUEST_LIMIT;
    }

    const entriesRemaining = limit - no_of_entries;

    console.log("entriesRemaining: ", entriesRemaining);

    if (entriesRemaining <= 0) {
      res.status(403).json({ message: "Face Detection Limit exceeded" });
      return;
    }
  } catch (err) {
    console.log("fetch entries error: ", err);
  }

  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      //   console.log("Clarifai data: ", util.inspect(data, false, null, true));

      res.json({ message: "success", data: data });
    })
    .catch((err) => {
      console.log("fetchApi error: ", err);
      res.status(404).json({ message: "Unable to fetch Clarifai api" });
    });
};

const handleClarifaiLocalImage = () => async (req, res) => {
  const { email } = req.body;
  try {
    const entries = await knex.raw(`  select entries,verified from users
                  where email='${email}';
        `);

    console.log("api call entries: ", entries.rows[0].entries);

    let no_of_entries = entries.rows[0].entries || 100;
    let limit;

    if (entries.rows.length > 0 && entries.rows[0].verified === true) {
      limit = CLARIFAI_API_USER_LIMIT;
    } else {
      limit = CLARIFAI_API_GUEST_LIMIT;
    }

    const entriesRemaining = limit - no_of_entries;

    console.log("entriesRemaining: ", entriesRemaining);

    if (entriesRemaining <= 0) {
      res.status(403).json({ message: "Face Detection Limit exceeded" });
      return;
    }
  } catch (err) {
    console.log("fetch entries error: ", err);
  }

  let src = req.body.input;
  src = src.substring(22, src.length);
  const imageBytes = src;

  // console.log("imageBytes: ", imageBytes);

  const app1 = new Clarifai.App({
    apiKey: API_KEY,
  });

  app1.models
    .predict(Clarifai.FACE_DETECT_MODEL, { base64: imageBytes })
    .then((data) => {
      // console.log("Clarifai data: ", util.inspect(data, false, null, true));
      // console.log("data claraifai bytes: ", data.toString());

      // console.log("success: ", data);
      res.json({ message: "success", data: data });
      // res.json({ bytes: imageBytes });
    })
    .catch((err) => {
      // fs.writeFileSync("some error: " + err, "error.txt");
      console.log("some error");
      res.status(400).json({ message: "some error" });
    });
};

module.exports = {
  handleClarifaiApiCall,
  handleClarifaiLocalImage,
};
