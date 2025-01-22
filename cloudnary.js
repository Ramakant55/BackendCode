const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dr9onxgme', // Cloudinary dashboard se lein
  api_key: '822127627765768',       // Cloudinary dashboard se lein
  api_secret: '08JQy7WWrZtIser3NiPUbU3Bf2U', // Cloudinary dashboard se lein
});

// Mongoose Configuration
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Schema and Model
const ImageSchema = new mongoose.Schema({
  url: String,
  public_id: String,
});

const Image = mongoose.model('Image', ImageSchema);

// Multer Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed formats
  },
});

const upload = multer({ storage: storage });

// Express App Setup
const app = express();
app.use(express.json());

// API Routes
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { path, filename } = req.file;

    // Save image details in MongoDB
    const image = new Image({
      url: path,
      public_id: filename,
    });

    await image.save();

    res.status(201).json({ message: 'Image uploaded successfully', image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
