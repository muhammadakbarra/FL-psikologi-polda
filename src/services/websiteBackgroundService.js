// src/services/websiteBackgroundService.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const prisma = new PrismaClient();

class WebsiteBackgroundService {
    // Mendapatkan background aktif
    async getActiveBackground() {
        return await prisma.websiteBackground.findFirst({
            where: { active: true },
        });
    }

    // Menyimpan gambar original dan membuat SVG dengan embedded image
    async createOrUpdateBackground(fileBuffer, originalname) {
        // Buat directory jika belum ada
        const backgroundDir = path.join(__dirname, '../../storage/background');
        if (!fs.existsSync(backgroundDir)) {
            fs.mkdirSync(backgroundDir, { recursive: true });
        }

        // Generate nama file SVG
        const svgFilename = `background-${Date.now()}.svg`;
        const svgPath = path.join(backgroundDir, svgFilename);

        // Konversi gambar ke base64 untuk embedding
        const imgBase64 = fileBuffer.toString('base64');
        const fileExt = path.extname(originalname).toLowerCase() || '.png';
        const mimeType = this.getMimeType(fileExt);

        // Buat SVG dengan embedded image dan namespace xlink yang benar
        const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">
    <image width="1" height="1" preserveAspectRatio="none"
           xlink:href="data:${mimeType};base64,${imgBase64}"/>
</svg>
`;

        fs.writeFileSync(svgPath, svgContent);

        // Simpan relative path untuk SVG
        const relativeSvgPath = `storage/background/${svgFilename}`;

        // Cek apakah sudah ada background aktif
        const existingBackground = await this.getActiveBackground();

        if (existingBackground) {
            // Update background yang ada
            const updated = await prisma.websiteBackground.update({
                where: { id: existingBackground.id },
                data: {
                    svg_path: relativeSvgPath,
                    updatedAt: new Date(),
                },
            });

            // Hapus file SVG lama jika berbeda
            if (existingBackground.svg_path !== relativeSvgPath) {
                const oldSvgPath = path.join(
                    __dirname,
                    '../../',
                    existingBackground.svg_path
                );
                if (fs.existsSync(oldSvgPath)) {
                    fs.unlinkSync(oldSvgPath);
                }
            }

            return updated;
        } else {
            // Buat background baru
            return await prisma.websiteBackground.create({
                data: {
                    svg_path: relativeSvgPath,
                    active: true,
                },
            });
        }
    }

    // Helper untuk mendapatkan MIME type
    getMimeType(extension) {
        const ext = extension.toLowerCase();

        switch (ext) {
            case '.jpg':
            case '.jpeg':
                return 'image/jpeg';
            case '.png':
                return 'image/png';
            case '.gif':
                return 'image/gif';
            case '.webp':
                return 'image/webp';
            default:
                return 'image/png';
        }
    }
}

module.exports = new WebsiteBackgroundService();
