const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Langsung dari folder utama — TIDAK PAKAI /public
app.use(express.static(__dirname));

// ✅ Buka index.html langsung
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Database
const DATA_PATH = path.join(__dirname, 'db.json');

if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));
}

function bacaData() {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); }
  catch { return {}; }
}

function simpanData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
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
