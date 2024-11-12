// controllers/fileController.js

const processedFiles = require('../utils/fileStorage');
const fileProcessor = require('../utils/fileProcessor');

/**
 * Handles file upload and initiates processing.
 */
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const socketId = req.body.socketId;
        if (!socketId) {
            return res.status(400).json({ error: 'No socket ID provided.' });
        }

        // Generate a unique file ID
        const fileId = Date.now().toString();

        // Store the file temporarily
        processedFiles[fileId] = {
            buffer: req.file.buffer,
            originalName: req.file.originalname,
        };

        // Emit 'processingStarted' event to the client
        req.io.to(socketId).emit('processingStarted', { fileId });

        // Start processing the file
        fileProcessor.processFile(fileId, req.io, socketId)
            .then(() => {
                res.status(200).json({ message: 'File is being processed.', fileId });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 'Error processing file.' });
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
};

/**
 * Handles file download.
 */
exports.downloadFile = (req, res) => {
    const fileId = req.params.fileId;
    const file = processedFiles[fileId];

    if (!file) {
        return res.status(404).json({ error: 'File not found or not processed yet.' });
    }

    res.set({
        'Content-Disposition': `attachment; filename=processed-${file.originalName}`,
        'Content-Type': 'application/octet-stream',
    });

    res.send(file.buffer);
};
