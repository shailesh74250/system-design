// Import Express
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
// Define the port
const PORT = 3000;

// Initialize the app
const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// create upload directory if not exists
if(!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// configure multer for the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // file will be saved to upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // unique filename
  },
});

// const upload = multer({ storage });

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
      if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error("Only JPEG, PNG, and MP4 files are allowed!"));
      }
      cb(null, true);
  },
});

// Endpoint for file upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
      return res.status(400).send("No file uploaded.");
  }
  console.log('file',req.file);
  res.status(200).send({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
  });
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// A simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});