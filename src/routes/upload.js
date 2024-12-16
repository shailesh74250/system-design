const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const File = require('../models/File');
const auth = require('../middleware/auth');

const router = express.Router();

// AWS s3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});


// configure multer for the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); // file will be saved to upload directory
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // unique filename
    },
  });

// Multer configuration and file validation
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "video/mp4"];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPEG, PNG, and MP4 files are allowed!"));
        }
        cb(null, true);
    },
});

router.post("/", auth, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded.");

        // Upload file to S3
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${Date.now()}-${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        const data = await s3.upload(uploadParams).promise();

        // Save file metadata in MongoDB
        const newFile = new File({
            fileName: req.file.originalname,
            fileUrl: data.Location,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user.id,
        });

        await newFile.save();

        res.status(201).json({ message: "File uploaded successfully.", file: newFile });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading file.");
    }
});

module.exports = router;