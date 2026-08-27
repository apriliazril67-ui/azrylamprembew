const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Sajikan file dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Halaman utama — WAJIB ADA! Ini yang bikin 404 kalau hilang!
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Path database
const DATA_DIR = path.join(__dirname, 'data');
const DATA_PATH = path.join(DATA_DIR, 'db.json');

// Pastikan folder & file ada
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));

const DATA_PATH = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));

function bacaData() {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); }
  catch { return {}; }
}
function simpanData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// API sederhana
app.get('/api/data', (req, res) => res.json(bacaData()));
app.post('/api/simpan', (req, res) => {
  const data = bacaData();
  Object.assign(data, req.body);
  simpanData(data);
  res.json({ sukses: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Jalan di port ${PORT}`));
