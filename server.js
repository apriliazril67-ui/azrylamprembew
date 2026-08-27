const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Sajikan file HTML
app.use(express.static(path.join(__dirname, 'public')));

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Ganti path data — simpan di folder yang pasti ada
const DATA_DIR = __dirname; // Langsung di folder utama, gak perlu folder data
const DATA_PATH = path.join(DATA_DIR, 'db.json');

// Pastikan file ada — gak perlu bikin folder!
if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, '{}', 'utf8');
}

// Fungsi baca tulis data
function bacaData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch {
    return {};
  }
}
function simpanData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// API
app.get('/api/data', (req, res) => res.json(bacaData()));
app.post('/api/simpan', (req, res) => {
  const data = bacaData();
  Object.assign(data, req.body);
  simpanData(data);
  res.json({ sukses: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Jalan di port ${PORT}`));
