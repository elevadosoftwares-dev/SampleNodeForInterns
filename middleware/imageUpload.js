const multer = require("multer");
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(process.cwd(), 'Media', 'Data', 'Image');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, uploadPath)
    },
    filename: (req, file, next) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        next(null, `${name}_${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, next) => {
    const allowedExt = /jpeg|jpg|png|gif/;

    const isExtValid = allowedExt.test(
        path.extname(file.originalname).toLowerCase()
    );

    const isMimeValid = allowedExt.test(
        file.mimetype
    );

    if (isExtValid && isMimeValid) {
        next(null, true);
    } else {
        next(new Error("Only image files are allowed"));

    }
}
const upload = multer({
    storage,
    fileFilter
});


exports.singleImageUploader = upload.single("image");
exports.multipleImageUploader = upload.array("image", 10);