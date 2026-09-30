const express = require('express');
const { createUser, updateUser, deleteUser, getAllImages, signUpUser, loginUser, getUser, profileImageUpload, productImageUpload, createUserMany, getAllUser } = require('../controller/sampleController');
const { verifyToken } = require('../middleware/authMiddleware');
const { singleImageUploader, multipleImageUploader } = require('../middleware/imageUpload');

const router = express.Router();

router.post("/register", signUpUser);
router.post("/login", loginUser);
router.post("/getUser", verifyToken, getUser);
router.post("/getAllUsers", verifyToken, getAllUser);
router.post("/create", verifyToken, createUser);
router.post("/createMany", verifyToken, createUserMany);
router.post("/update/:id", verifyToken, updateUser);
router.post("/delete/:id", verifyToken, deleteUser);
// router.post("/singleUpload", singleImageUploader);
// router.post("/multiUpload", multiImageUploader);
// router.get("/getAllImages", getAllImages);


router.post("/profileUpload", singleImageUploader, profileImageUpload);
router.post("/productUpload", multipleImageUploader, productImageUpload);

module.exports = router;