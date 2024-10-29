const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.post('/upload', upload.single('image'), (req, res) => {
  res.status(200).json({ message: 'Image uploaded successfully', filename: req.file.filename });
});


app.get('/download/:filename/:angle', async (req, res) => {
  const { filename, angle } = req.params;
  const inputPath = path.join(__dirname, 'uploads', filename);
  const outputPath = path.join(__dirname, 'uploads', `rotated_${angle}_${filename}`);

  try {
    await sharp(inputPath)
      .rotate(parseInt(angle))
      .toFile(outputPath);

    res.download(outputPath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error in downloading the file');
      }

      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the image');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
