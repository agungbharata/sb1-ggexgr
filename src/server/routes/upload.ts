import express from 'express';
import upload from '../uploadMiddleware';
import { uploadImage, deleteUploadedImage } from '../uploadController';

const router = express.Router();

// Route untuk upload gambar
router.post('/image', upload.single('image'), uploadImage);

// Route untuk hapus gambar
router.delete('/image', deleteUploadedImage);

export default router;
