const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Cara paling pasti — langsung tunjuk folder utama
app.use(express.static(path.resolve(__dirname)));

// ✅ Halaman utama — cara paling aman
app.get('/', (req, res) => {
  const file = path.resolve(__dirname, 'index.html');
  res.sendFile(file);
});

// Database
const DB_PATH = path.resolve(__dirname, 'db.json');

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, '{}', 'utf8');
}

function bacaData() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function simpanData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/data', (req, res) => res.json(bacaData()));

app.post('/api/simpan', (req, res) => {
  const data = bacaData();
  Object.assign(data, req.body);
  simpanData(data);
  res.json({ sukses: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Jalan di port ${PORT}`));
