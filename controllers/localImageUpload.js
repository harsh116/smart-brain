const multer = require("multer");
const fs = require("fs");

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("myFile");

const handleImageUpload = () => (req, res) => {
  let imageBytes, src;
  console.log("handlelocal");
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json({ message: "Multer error" });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ message: "other error" });
    }

    fs.readFile(
      `uploads/${req.file?.originalname || ""}`,
      "base64",
      (err, imageBytes) => {
        if (err) {
          console.log(err);
          res.status(500).json("some error while uploading");
        }
        src = "data:image/png;base64," + imageBytes;

        fs.unlinkSync(`uploads/${req.file.originalname}`);

        // console.log("upload src: ", src);

        console.log(req.file);
        // return res.status(200).send(req.file);
        res.json({
          message: "success",
          messageDisplay: "Image Uploaded",
          src,
        });
      }
    );

    // imageBytes = fs.readFileSync(`uploads/${req.file.originalname}`, {
    //   encoding: "base64",
    // });
  });

  // res.json({
  //   message: "success",
  //   messageDisplay: "Image Uploaded",
  //   src,
  // });
};

module.exports = {
  handleImageUpload,
};
