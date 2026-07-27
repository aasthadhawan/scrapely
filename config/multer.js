const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "scrapely",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        resource_type: "image"
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed."), false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;