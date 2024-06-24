const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/transactions/");
  },
  filename: function (req, file, cb) {
    cb(null, "transaction" + "-" + Date.now() + "-" + req.session.id + ".jpg");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.fieldname === "transaction" &&
      (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

module.exports = upload;
