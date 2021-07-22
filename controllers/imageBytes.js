const fs = require("fs");
const request = require("request");
var http = require("http"),
  https = require("https"),
  Stream = require("stream").Transform;
const fetch = require("node-fetch");

// var progress = require("request-progress");

const download = async function (uri, filename, callback) {
  //   progress(request(uri))
  //     // .on('progress', onProgress)
  //     .on("response", (res) => {
  //       //   console.log("res in progress(): ", res);
  //     })
  //     .on("error", (err) => console.log(err))
  //     .on("end", () => {
  //       console.log("done");
  //       callback();
  //     })
  //     .pipe(fs.createWriteStream(filename));

  //   request.head(uri, function (err, res, body) {
  //     // console.log("content-type:", res.headers["content-type"]);
  //     // console.log("content-length:", res.headers["content-length"]);

  //     request(uri)
  //       .pipe(fs.createWriteStream(filename))
  //       //   .on("error", () => {
  //       //     console.log("error");
  //       //   })
  //       .on("close", callback);
  //   });

  //   var client = http;
  //   if (uri.toString().indexOf("https") === 0) {
  //     client = https;
  //   }

  //   client
  //     .request(uri, function (response) {
  //       var data = new Stream();

  //       console.log("uri: ", uri);

  //       response.on("data", function (chunk) {
  //         console.log("chunk: ", chunk);
  //         data.push(chunk);
  //       });

  //       response.on("error", (err) => {
  //         console.log(err);
  //       });

  //       response.on("end", function () {
  //         let dataRead = data.read();
  //         console.log("data read(): ", data.read());

  //         fs.writeFileSync(filename, dataRead.toString());
  //         callback();
  //       });
  //     })
  //     .end();

  const response = await fetch(uri);
  const buffer = await response.buffer();
  fs.writeFile(filename, buffer, () => {
    console.log("finished downloading!");
    callback();
  });
};

const getImageBytes = () => (req, res) => {
  const { src } = req.body;

  download(src, "uploads/image1.png", () => {
    fs.readFile("uploads/image1.png", "base64", (err, bytes) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
      } else {
        fs.unlinkSync("uploads/image1.png");

        // console.log(bytes);

        const imageBytes = "data:image/png;base64," + bytes;
        res.json({ message: "success", imageBytes });
      }
    });
  });
};

module.exports = {
  getImageBytes,
};
