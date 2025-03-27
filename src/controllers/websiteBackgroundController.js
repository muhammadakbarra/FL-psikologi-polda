// src/controllers/websiteBackgroundController.js
const websiteBackgroundService = require('../services/websiteBackgroundService');
const path = require('path');
const fs = require('fs');

class WebsiteBackgroundController {
    // Get active background
    async getBackground(req, res, next) {
        try {
            const background =
                await websiteBackgroundService.getActiveBackground();

            if (!background) {
                return res.status(404).json({
                    success: false,
                    message: 'Background belum diatur',
                });
            }

            return res.status(200).json({
                success: true,
                data: background,
            });
        } catch (error) {
            next(error);
        }
    }

    // Create or update background
    async updateBackground(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'File gambar tidak ditemukan',
                });
            }

            const background =
                await websiteBackgroundService.createOrUpdateBackground(
                    req.file.buffer,
                    req.file.originalname
                );

            return res.status(200).json({
                success: true,
                message: 'Background berhasil diperbarui',
                data: background,
            });
        } catch (error) {
            next(error);
        }
    }

    // Serve background image
    async serveBackgroundImage(req, res, next) {
        try {
            const background =
                await websiteBackgroundService.getActiveBackground();

            if (!background) {
                return res.status(404).send('Background tidak ditemukan');
            }

            const imagePath = path.join(
                __dirname,
                '../../',
                background.svg_path
            );

            if (!fs.existsSync(imagePath)) {
                return res.status(404).send('File background tidak ditemukan');
            }

            res.sendFile(imagePath);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WebsiteBackgroundController();
