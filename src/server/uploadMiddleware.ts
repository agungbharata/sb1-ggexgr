import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Konfigurasi penyimpanan sementara
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads/temp'));
  },
  filename: (req, file, cb) => {
    // Generate nama file yang aman
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${timestamp}-${random}${extension}`);
  }
});

// Filter file
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Cek mime type
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipe file tidak diizinkan'));
  }
};

// Konfigurasi upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Maksimal 10 file sekaligus
  }
});

export default upload;
