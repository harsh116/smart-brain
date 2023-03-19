// require('dotenv').config()

const fetch = require("node-fetch");

class ClarifaiAPI {
  constructor(options) {
    this.access_token = options.access_token;
    this.user_id = options.user_id;
    this.app_id = options.app_id;
    this.clarifaiURL =
      "https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs";

    this.rawObj = {
      user_app_id: {
        user_id: this.user_id,
        app_id: this.app_id,
      },
      inputs: [
        {
          data: {
            image: {},
          },
        },
      ],
    };

    this.requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + this.access_token,
      },
      body: "",
    };
  }

  postImageURL = async (url) => {
    console.log("token: ", this.access_token);
    console.log("user: ", this.user_id);
    console.log("app: ", this.app_id);

    this.rawObj.inputs[0].data.image["url"] = url;
    const raw = JSON.stringify(this.rawObj);
    this.requestOptions.body = raw;

    console.log("reqOptions: ", this.requestOptions);

    const res = await fetch(this.clarifaiURL, this.requestOptions);
    const dataJSON = await res.text();
    const dataobj = JSON.parse(dataJSON);

    return dataobj;
  };

  postBase64 = async (base64) => {
    this.rawObj.inputs[0].data.image["base64"] = base64;
    const raw = JSON.stringify(this.rawObj);
    this.requestOptions.body = raw;

    const res = await fetch(this.clarifaiURL, this.requestOptions);
    const dataJSON = await res.text();
    const dataobj = JSON.parse(dataJSON);

    return dataobj;
  };
}

module.exports = ClarifaiAPI;
