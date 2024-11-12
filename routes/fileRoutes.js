// routes/fileRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');

// Configure Multer for in-memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/octet-stream' || file.mimetype === 'application/x-fit') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only .fit files are allowed.'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter,
});
// POST /api/files/upload
router.post('/upload', upload.single('fitFile'), fileController.uploadFile);

// GET /api/files/download/:fileId
router.get('/download/:fileId', fileController.downloadFile);

module.exports = router;
