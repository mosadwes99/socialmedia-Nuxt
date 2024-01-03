import multer from "multer";
export default function imageUpload(fieldName) {
  let storage = multer.diskStorage({
    destination: function (cb) {
      cb(null, "uploads/");
    },
    filename: function (file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  let upload = multer({ storage });
  return upload.array(fieldName);
}
