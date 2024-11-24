import { Request, Response } from 'express';
import { initializeMediaStorage, saveImage, deleteImage } from '../utils/mediaStorage';
import { compressImage } from '../utils/imageCompression';
import path from 'path';
import fs from 'fs';

// Inisialisasi storage saat server start
initializeMediaStorage();

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diupload' });
    }

    const { type } = req.body;
    if (!['cover', 'bride', 'groom', 'gallery'].includes(type)) {
      return res.status(400).json({ error: 'Tipe gambar tidak valid' });
    }

    // Simpan file ke storage
    const filePath = await saveImage(req.file, type);

    // Hapus file temporary
    const tempPath = path.join(process.cwd(), 'uploads/temp', req.file.filename);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    res.json({ 
      success: true, 
      filePath,
      message: 'File berhasil diupload' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Gagal mengupload file',
      details: error.message 
    });
  }
};

export const deleteUploadedImage = async (req: Request, res: Response) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({ error: 'Path file tidak ditemukan' });
    }

    await deleteImage(filePath);

    res.json({ 
      success: true, 
      message: 'File berhasil dihapus' 
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: 'Gagal menghapus file',
      details: error.message 
    });
  }
};
