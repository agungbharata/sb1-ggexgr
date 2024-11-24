import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = join(dirname(__dirname));
const UPLOAD_DIR = join(ROOT_DIR, 'uploads');
const IMAGES_DIR = join(UPLOAD_DIR, 'images');
const TEMP_DIR = join(UPLOAD_DIR, 'temp');

// Buat direktori jika belum ada
const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`📁 Directory exists: ${dir}`);
  }
};

// Buat file .htaccess untuk keamanan
const createHtaccess = () => {
  const htaccessContent = `
# Disable directory listing
Options -Indexes

# Deny access to files starting with dot
<FilesMatch "^\.">
  Order allow,deny
  Deny from all
</FilesMatch>

# Allow only specific image types
<FilesMatch "\.(jpg|jpeg|png|gif)$">
  Order allow,deny
  Allow from all
</FilesMatch>

# Deny access to sensitive files
<FilesMatch "\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|htm|html|shtml|sh|cgi)$">
  Order allow,deny
  Deny from all
</FilesMatch>

# Enable Apache XSS protection
<IfModule mod_headers.c>
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>

# Disable PHP execution
<FilesMatch ".+\.ph(p[3457]?|t|tml)$">
  deny from all
</FilesMatch>

# Protect against malicious file uploads
<FilesMatch "(?i)\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|htm|html|shtml|sh|cgi)$">
  deny from all
</FilesMatch>

# Protect .htaccess
<Files .htaccess>
  Order allow,deny
  Deny from all
</Files>

# Set content-type for images
<IfModule mod_mime.c>
  AddType image/jpeg .jpg .jpeg
  AddType image/png .png
  AddType image/gif .gif
</IfModule>

# Enable CORS for images
<IfModule mod_headers.c>
  <FilesMatch "\.(jpg|jpeg|png|gif)$">
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
</IfModule>
`;

  fs.writeFileSync(join(UPLOAD_DIR, '.htaccess'), htaccessContent.trim());
  console.log('✅ Created .htaccess file');
};

// Buat file index.html kosong untuk keamanan
const createEmptyIndex = (dir) => {
  const indexContent = `
<!DOCTYPE html>
<html>
<head>
  <title>403 Forbidden</title>
</head>
<body>
  <h1>Forbidden</h1>
  <p>You don't have permission to access this directory.</p>
</body>
</html>
`;
  fs.writeFileSync(join(dir, 'index.html'), indexContent.trim());
  console.log(`✅ Created index.html in ${dir}`);
};

// Fungsi utama
const initStorage = () => {
  console.log('🚀 Initializing storage structure...\n');

  try {
    // Buat direktori
    createDirectory(UPLOAD_DIR);
    createDirectory(IMAGES_DIR);
    createDirectory(TEMP_DIR);

    // Buat file keamanan
    createHtaccess();
    createEmptyIndex(UPLOAD_DIR);
    createEmptyIndex(IMAGES_DIR);
    createEmptyIndex(TEMP_DIR);

    console.log('\n✨ Storage structure initialized successfully!');
    console.log(`
📁 Structure created:
${UPLOAD_DIR}
├── .htaccess
├── index.html
├── images/
│   └── index.html
└── temp/
    └── index.html
`);
  } catch (error) {
    console.error('\n❌ Error initializing storage:', error);
    process.exit(1);
  }
};

// Jalankan inisialisasi
initStorage();
