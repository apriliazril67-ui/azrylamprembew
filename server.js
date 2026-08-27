const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path database — ini yang tadi di gambar
const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/app/data' 
  : path.join(__dirname, 'data');

const DATA_PATH = path.join(DATA_DIR, 'db.json');

// Pastikan folder & file ada
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));

// Fungsi baca tulis data
function bacaData() {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); }
  catch { return {}; }
}
function simpanData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Jalan di port ${PORT}`));
