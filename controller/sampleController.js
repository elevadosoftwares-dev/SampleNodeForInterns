// const createUser = (req, res) => {
//     console.log("Hello");
//     res.send("User controller works");
// };
const UserModel = require('../model/sampleModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUpUser = async (req, res, next) => {
    try {
        const { name, phone, email, password } = req.body;

        // 1️⃣ Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 2️⃣ Check email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // 3️⃣ Hash password
        // const hashPassword = await bcrypt.hash(password, 10);
        // alternate
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // 4️⃣ Save user
        const user = new UserModel({
            name,
            phone,
            email,
            password: hashPassword
        });

        await user.save();

        // 5️⃣ Success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        }); 

    } catch (err) {
        // console.error(error);
        // res.status(500).json({
        //     success: false,
        //     message: "Server error"
        // });
        next(err)
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(200).json({
                success: false,
                message: "NO User Found"
            });
        }

        const check = await bcrypt.compare(password, existingUser.password);
        if (!check) {
            return res.status(200).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const result = await UserModel.findById(existingUser._id).select('-password');

        const generateToken = await jwt.sign(
            {
                userId: existingUser._id,
                name: existingUser.name,
                phone: existingUser.phone,
                email: existingUser.email,
            },
            process.env.jwt_secret
            // {
            //     expiresIn: "7d"
            // }
        )

        // 5️⃣ Success response
        res.status(201).json({
            success: true,
            message: "User logged successfully",
            user: result,
            token: generateToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getUser = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(200).json({
                success: false,
                message: "NO User Found"
            });
        }

        const result = await UserModel.findById(existingUser._id).select('-password');



        // 5️⃣ Success response
        res.status(201).json({
            success: true,
            user: result,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// const createUser = async (req, res) => {
//     try {
//         const {
//             sampleId,
//             name,
//             phone,
//             email,
//             address: { doorno }
//         } = req.body;

//         const demo = new UserModel({
//             sampleId,
//             name,
//             phone,
//             email,
//             address: doorno
//         });
//         console.log("demo");
//         console.log(demo);
//         const result = await demo.save();
//         res.status(200).send({
//             success: true,
//             result: result
//         });

//     } catch (error) {
//         res.status(200).send({
//             success: false,
//         });
//     }
// };

const createUser = async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            password,
            address: { doorno }
        } = req.body;

        // Get the last sample
        const lastUser = await UserModel
            .findOne()
            .sort({ sampleId: -1 });

        const sampleId = lastUser
            ? lastUser.sampleId + 1
            : 1;

        const user = new UserModel({
            sampleId,
            name,
            phone,
            email,
            password,
            address: doorno
        });

        const result = await user.save();

        res.status(201).send({
            success: true,
            result
        });

    } catch (error) {
        console.error(error);

        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

const createUserMany = async (req, res, next) => {
    try {
        const users = req.body; // expect array

        if (!Array.isArray(users)) {
            return res.status(400).send({
                success: false,
                message: "Expected an array of users"
            });
        }

        const formattedUsers = users.map(user => ({
            sampleId: user.sampleId,
            name: user.name,
            phone: user.phone,
            email: user.email,
            address: user.address?.doorno || "" // safe access
        }));

        const result = await UserModel.insertMany(formattedUsers);

        res.status(200).send({
            success: true,
            result: result
        });

    } catch (error) {
        // res.status(500).send({
        //     success: false,
        //     message: error.message
        // });
        next(error);
    }
};

const updateUser = async (req, res) => {
    try {
        const updateData = req.body;
        const { id } = req.params;
        const result = await UserModel.findByIdAndUpdate(
            id,
            { $set: updateData },   // update only given fields
            { new: true }
        );
        res.status(200).send({
            success: true,
            result: result
        });
    } catch (error) {
        res.status(200).send({
            success: false,
        });
    }

};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await UserModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
        });
    } catch (error) {
        res.status(200).send({
            success: false,
        });
    }
}

const getAllUser = async (req, res) => {
    try {
        const existingUser = await UserModel.find();
        if (!existingUser) {
            return res.status(200).json({
                success: false,
                message: "NO User Found"
            });
        }

        // 5️⃣ Success response
        res.status(201).json({
            success: true,
            users: existingUser,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
// const multer = require('multer');
// const path = require("path");
// const fs = require("fs");

// // Ensure upload folder exists
// const filepath = path.join(__dirname, "../Data/Image");

// if (!fs.existsSync(filepath)) {
//     fs.mkdirSync(filepath, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, filepath);
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const baseName = path.basename(file.originalname, ext);
//         const uniqueName = `${baseName}_${Date.now()}${ext}`;
//         cb(null, uniqueName);
//     }
// });

// // Single file uploader
// const singleUpload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = /jpeg|jpg|png|gif/;
//         const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         const mime = allowedTypes.test(file.mimetype);
//         if (ext && mime) cb(null, true);
//         else cb(new Error("Only images are allowed"));
//     }
// }).single("image");

// const singleImageUploader = (req, res) => {
//     singleUpload(req, res, (err) => {
//         if (err) return res.status(400).json({ message: 'Error uploading file', error: err.message });
//         if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

//         const uploadedFilePath = `/Data/Image/${req.file.filename}`;
//         res.status(200).json({ success: true, message: 'Image uploaded successfully', imageUrl: uploadedFilePath });
//     });
// }

// // Multiple files uploader
// const multiUpload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = /jpeg|jpg|png|gif/;
//         const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         const mime = allowedTypes.test(file.mimetype);
//         if (ext && mime) cb(null, true);
//         else cb(new Error("Only images are allowed"));
//     }
// }).array("image", 10);

// const multiImageUploader = (req, res) => {
//     multiUpload(req, res, (err) => {
//         if (err) return res.status(400).json({ message: 'Error uploading files', error: err.message });
//         if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

//         const uploadedFilePaths = req.files.map(file => `/Data/Image/${file.filename}`);
//         res.status(200).json({ success: true, message: 'Images uploaded successfully', files: uploadedFilePaths });
//     });
// }


// Get all images
// const getAllImages = (req, res) => {
//     const folderPath = path.join(process.cwd(), "Data", "Image");

//     fs.readdir(folderPath, (err, files) => {
//         if (err) return res.status(500).json({ message: "Error reading folder", error: err.message });

//         // Optional: filter only image files
//         const allowedTypes = /jpeg|jpg|png|gif/;
//         const images = files.filter(file => allowedTypes.test(path.extname(file).toLowerCase()));

//         // Map to full URLs
//         const imageUrls = images.map(file => `/Data/Image/${file}`);

//         res.status(200).json({ success: true, images: imageUrls });
//     });
// };

const profileImageUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
    }
    res.status(200).json({
        success: true,
        imageUrl: `/Data/Image/${req.file.filename}`,
    });
}

const productImageUpload = (req, res) => {
    if (!req.files || req.files.length == 0) {
        return res.status(400).json({ message: "No image uploaded" });
    }
    const images = req.files.map(
        (file) => `/Data/Image/${file.filename}`
    );
    res.status(200).json({
        success: true,
        images
    });
}

module.exports = {
    profileImageUpload,
    productImageUpload,
    signUpUser,
    loginUser,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAllUser,
    // singleImageUploader,
    // multiImageUploader,
    // getAllImages,
    createUserMany
}
