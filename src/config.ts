// Konfigurasi API URL berdasarkan environment
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.weddinggas.com' // Ganti dengan URL production Anda
  : 'http://localhost:3001';
